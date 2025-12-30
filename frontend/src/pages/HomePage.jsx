// src/pages/HomePage.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Settings, X, Play, Pause, ChevronLeft, ChevronRight, 
    Trash2, Plus, Save, Coffee, Volume2, VolumeX, TableProperties 
} from 'lucide-react';

function HomePage() {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState(null);
    const [blinds, setBlinds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    
    const timerRef = useRef(null);
    const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg'));
    // isMounted não é mais necessário para o problema atual, mas pode ser útil para outras otimizações
    // const isMounted = useRef(true); 

    // Esta função é para recarregar blinds de uma sessão JÁ ESTABELECIDA
    const fetchBlindsData = useCallback(async (sId) => {
        try {
            const idToUse = sId || sessionId || localStorage.getItem('poker_session_id');
            if (!idToUse) return;

            const response = await api.get('/session/blinds', {
                headers: { 'X-Session-Id': idToUse }
            });
            setBlinds(response.data);
            return response.data;
        } catch (err) {
            console.error("Erro ao carregar blinds:", err);
            // Se falhar ao carregar blinds, pode ser que a sessão tenha expirado
            // ou o ID no localStorage é inválido.
            // Para este cenário, o fluxo de inicialização já lida com a criação de uma nova sessão.
        }
    }, [sessionId]);

    useEffect(() => {
        // Flag para controlar se a limpeza/inicialização já foi feita NESTA sessão do navegador
        const SESSION_INITIALIZED_FLAG = 'poker_session_initialized';

        const initAndCleanupSession = async () => {
            setLoading(true);
            const previousSessionId = localStorage.getItem('poker_session_id');
            const hasSessionBeenInitialized = sessionStorage.getItem(SESSION_INITIALIZED_FLAG);

            // Se a sessão já foi inicializada NESTA ABA DO NAVEGADOR, apenas carregue os dados
            if (hasSessionBeenInitialized && previousSessionId) {
                console.log(`Sessão já inicializada nesta aba. Carregando dados da sessão: ${previousSessionId}`);
                const data = await fetchBlindsData(previousSessionId);
                if (data) {
                    setSessionId(previousSessionId);
                    if (data.length > 0) setTimeLeft(data[0].duration * 60);
                } else {
                    // Se o fetchBlindsData falhar (sessão expirou no backend), força uma nova sessão
                    console.warn("Sessão existente inválida, forçando nova inicialização.");
                    sessionStorage.removeItem(SESSION_INITIALIZED_FLAG); // Reseta a flag
                    await initAndCleanupSession(); // Chama recursivamente para iniciar nova sessão
                    return;
                }
                setLoading(false);
                return;
            }

            // 1. Limpar a sessão ANTERIOR (se houver) - Isso só acontece na primeira carga ou F5
            if (previousSessionId) {
                try {
                    console.log(`Tentando limpar a sessão anterior (blinds e participantes): ${previousSessionId}`);
                    await api.post('/session/end', {}, { 
                        headers: { 'X-Session-Id': previousSessionId }
                    });
                    console.log(`Sessão ${previousSessionId} limpa com sucesso.`);
                } catch (cleanupErr) {
                    console.warn(`Falha ao limpar sessão anterior ${previousSessionId}. Pode já ter sido encerrada ou ID inválido. Erro:`, cleanupErr);
                }
                localStorage.removeItem('poker_session_id'); // Sempre limpa o ID anterior do localStorage
            }

            // 2. Iniciar uma NOVA sessão principal
            try {
                console.log("Iniciando uma nova sessão principal...");
                const response = await api.post('/session/start');
                const newSessionId = response.data.sessionId;
                localStorage.setItem('poker_session_id', newSessionId);
                sessionStorage.setItem(SESSION_INITIALIZED_FLAG, 'true'); // Marca que a sessão foi inicializada nesta aba
                setSessionId(newSessionId);
                setBlinds(response.data.defaultBlinds);
                if (response.data.defaultBlinds.length > 0) {
                    setTimeLeft(response.data.defaultBlinds[0].duration * 60);
                }
                setError(null);
                console.log(`Nova sessão iniciada: ${newSessionId}`);
            } catch (startErr) {
                console.error("Erro ao iniciar nova sessão:", startErr);
                setError("Erro ao iniciar nova sessão.");
            } finally {
                setLoading(false);
            }
        };

        initAndCleanupSession(); // Executa o fluxo de inicialização

        // 3. Handler para fechar a sessão PRINCIPAL apenas em FECHAMENTO DE ABA ou RECARGA
        const handleBeforeUnload = () => {
            const currentActiveSessionId = localStorage.getItem('poker_session_id');
            if (currentActiveSessionId) {
                // Chama o endpoint de encerramento da sessão principal (que agora limpa tudo)
                fetch('http://localhost:8080/session/end', {
                    method: 'POST',
                    headers: {
                        'X-Session-Id': currentActiveSessionId,
                        'Content-Type': 'application/json'
                    },
                    keepalive: true // Garante que a requisição seja enviada mesmo com a aba fechando
                });
                localStorage.removeItem('poker_session_id'); // Limpa o ID atual do localStorage
                sessionStorage.removeItem(SESSION_INITIALIZED_FLAG); // Limpa a flag do sessionStorage
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Cleanup: Remove o event listener ao desmontar o componente
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // Array de dependências vazio para rodar apenas uma vez ao montar

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    const nextTime = prev - 1;
                    if (isSoundEnabled && nextTime <= 10 && nextTime >= 0) {
                        if (blinds[currentIndex]?.level !== 0) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().catch(() => {});
                        }
                    }
                    return nextTime;
                });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleNextLevel();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, isSoundEnabled, currentIndex, blinds]);

    const handleAddBlind = async () => {
        try {
            await api.post('/blinds/add', {}, { headers: { 'X-Session-Id': sessionId } });
            await fetchBlindsData(sessionId);
        } catch (err) { alert("Erro ao adicionar blind"); }
    };

    const handleAddBreak = async () => {
        try {
            await api.post('/breaks/add', {}, { headers: { 'X-Session-Id': sessionId } });
            await fetchBlindsData(sessionId);
        } catch (err) { alert("Erro ao adicionar intervalo"); }
    };

    const handleDeleteBlind = async (id) => {
        if (!window.confirm("Deseja deletar?")) return;
        try {
            await api.delete(`/blinds/delete/${id}`, { headers: { 'X-Session-Id': sessionId } });
            await fetchBlindsData(sessionId);
        } catch (err) { alert("Erro ao deletar"); }
    };

    const handleUpdateBlind = async (blind) => {
        try {
            const payload = {
                smallBlind: parseInt(blind.smallBlind),
                bigBlind: parseInt(blind.bigBlind),
                ante: parseInt(blind.ante),
                duration: parseInt(blind.duration)
            };
            await api.put(`/blinds/update/${blind.id}`, payload, { headers: { 'X-Session-Id': sessionId } });
            const updated = await fetchBlindsData(sessionId);
            if (updated && updated[currentIndex]?.id === blind.id) setTimeLeft(parseInt(blind.duration) * 60);
        } catch (err) { alert("Erro ao atualizar blind"); }
    };

    const handleUpdateBreak = async (breakItem) => {
        try {
            const payload = { duration: parseInt(breakItem.duration) };
            await api.put(`/breaks/update/${breakItem.id}`, payload, { headers: { 'X-Session-Id': sessionId } });
            const updated = await fetchBlindsData(sessionId);
            if (updated && updated[currentIndex]?.id === breakItem.id) setTimeLeft(parseInt(breakItem.duration) * 60);
        } catch (err) { alert("Erro ao atualizar intervalo"); }
    };

    const handleInputChange = (index, field, value) => {
        const newBlinds = [...blinds];
        newBlinds[index][field] = value;
        setBlinds(newBlinds);
    };

    const handleNextLevel = () => {
        if (currentIndex < blinds.length - 1) {
            const idx = currentIndex + 1;
            setCurrentIndex(idx);
            setTimeLeft(blinds[idx].duration * 60);
        } else setIsActive(false);
    };

    const handlePrevLevel = () => {
        if (currentIndex > 0) {
            const idx = currentIndex - 1;
            setCurrentIndex(idx);
            setTimeLeft(blinds[idx].duration * 60);
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (loading) return <div style={styles.container}><h1 style={{color: '#61dafb'}}>NUTSPOKER</h1></div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div onClick={() => setIsSoundEnabled(!isSoundEnabled)} style={{ cursor: 'pointer' }}>
                    {isSoundEnabled ? <Volume2 color="#61dafb" size={28} /> : <VolumeX color="#ff6b6b" size={28} />}
                </div>
                <Settings color="#61dafb" size={28} style={{ cursor: 'pointer' }} onClick={() => setShowSettings(true)} />
            </div>

            <div style={styles.brandContainer}>
                <h1 style={styles.title}>NUTSPOKER</h1>
                <button 
                    onClick={() => navigate('/participants')}
                    style={styles.participantsBtn}
                >
                    <TableProperties size={18} /> TABELAS DOS PARTICIPANTES
                </button>
            </div>

            <div style={styles.timerWrapper}>
                <div style={styles.sideBlind}>
                    {blinds[currentIndex - 1] && (
                        <>
                            <div style={styles.sideLabel}>PREVIOUS</div>
                            <div style={styles.sideValues}>{blinds[currentIndex-1].smallBlind}/{blinds[currentIndex-1].bigBlind}</div>
                            {blinds[currentIndex-1].ante > 0 && <div style={styles.sideAnte}>Ante: {blinds[currentIndex-1].ante}</div>}
                        </>
                    )}
                </div>

                <div style={styles.mainTimerContainer}>
                    <div style={styles.timeDisplay}>{formatTime(timeLeft)}</div>
                    <div style={styles.currentLevelInfo}>
                        <div style={styles.levelName}>
                            {blinds[currentIndex]?.level === 0 ? "COFFEE BREAK" : `LEVEL ${blinds[currentIndex]?.level}`}
                        </div>
                        <div style={styles.mainBlindValues}>
                            {blinds[currentIndex]?.smallBlind} / {blinds[currentIndex]?.bigBlind}
                        </div>
                        {blinds[currentIndex]?.ante > 0 && (
                            <div style={styles.mainAnteDisplay}>ANTE {blinds[currentIndex]?.ante}</div>
                        )}
                    </div>
                </div>

                <div style={styles.sideBlind}>
                    {blinds[currentIndex + 1] && (
                        <>
                            <div style={styles.sideLabel}>NEXT</div>
                            <div style={styles.sideValues}>{blinds[currentIndex+1].smallBlind}/{blinds[currentIndex+1].bigBlind}</div>
                            {blinds[currentIndex+1].ante > 0 && <div style={styles.sideAnte}>Ante: {blinds[currentIndex+1].ante}</div>}
                        </>
                    )}
                </div>
            </div>

            <div style={styles.controls}>
                <button style={styles.navButton} onClick={handlePrevLevel} disabled={currentIndex === 0}><ChevronLeft size={40} color="white" /></button>
                <button style={styles.playButton} onClick={() => setIsActive(!isActive)}>
                    {isActive ? <Pause size={40} fill="white" color="white" /> : <Play size={40} fill="white" color="white" />}
                </button>
                <button style={styles.navButton} onClick={handleNextLevel} disabled={currentIndex === blinds.length - 1}><ChevronRight size={40} color="white" /></button>
            </div>

            {showSettings && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={{ color: '#61dafb' }}>ESTRUTURA DO TORNEIO</h2>
                            <X color="#ff6b6b" size={30} style={{ cursor: 'pointer' }} onClick={() => setShowSettings(false)} />
                        </div>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Lv</th>
                                        <th style={styles.th}>Small</th>
                                        <th style={styles.th}>Big</th>
                                        <th style={styles.th}>Ante</th>
                                        <th style={styles.th}>Duração</th>
                                        <th style={styles.th}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blinds.map((b, i) => (
                                        <tr key={b.id || i} style={{ borderBottom: '1px solid #333' }}>
                                            <td style={styles.td}>{b.level === 0 ? "BRK" : b.level}</td>
                                            <td style={styles.td}><input style={styles.input} type="number" value={b.smallBlind} onChange={(e) => handleInputChange(i, 'smallBlind', e.target.value)} disabled={b.level === 0} /></td>
                                            <td style={styles.td}><input style={styles.input} type="number" value={b.bigBlind} onChange={(e) => handleInputChange(i, 'bigBlind', e.target.value)} disabled={b.level === 0} /></td>
                                            <td style={styles.td}><input style={styles.input} type="number" value={b.ante} onChange={(e) => handleInputChange(i, 'ante', e.target.value)} disabled={b.level === 0} /></td>
                                            <td style={styles.td}><input style={styles.input} type="number" value={b.duration} onChange={(e) => handleInputChange(i, 'duration', e.target.value)} /></td>
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                    <button onClick={() => b.level === 0 ? handleUpdateBreak(b) : handleUpdateBlind(b)} style={styles.iconBtn}><Save size={20} color="#4caf50" /></button>
                                                    <button onClick={() => handleDeleteBlind(b.id)} style={styles.iconBtn}><Trash2 size={20} color="#ff6b6b" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={styles.modalFooter}>
                            <button style={styles.addButton} onClick={handleAddBlind}><Plus size={20} /> NOVO NÍVEL</button>
                            <button style={{...styles.addButton, backgroundColor: '#ff9800'}} onClick={handleAddBreak}><Coffee size={20} /> INTERVALO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', fontFamily: '"Courier New", Courier, monospace', padding: '0 40px' },
    header: { position: 'absolute', top: '25px', right: '40px', display: 'flex', gap: '25px', alignItems: 'center' },
    brandContainer: { position: 'absolute', top: '25px', left: '40px', display: 'flex', flexDirection: 'column', gap: '10px' },
    title: { fontSize: '2.2em', color: '#61dafb', margin: 0, letterSpacing: '6px', fontWeight: 'bold' },
    participantsBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', border: '1px solid #61dafb', color: '#61dafb', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em', letterSpacing: '2px', fontWeight: 'bold', transition: '0.3s' },
    timerWrapper: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1400px', marginTop: '20px' },
    mainTimerContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 2 },
    timeDisplay: { fontSize: '12vw', fontWeight: 'bold', lineHeight: '1', color: '#fff', textShadow: '0 0 20px rgba(97, 218, 251, 0.2)' },
    currentLevelInfo: { textAlign: 'center', marginTop: '15px' },
    levelName: { fontSize: '1.8em', color: '#61dafb', letterSpacing: '3px' },
    mainBlindValues: { fontSize: '3.5em', fontWeight: 'bold', margin: '8px 0' },
    mainAnteDisplay: { fontSize: '1.4em', backgroundColor: '#333', padding: '4px 25px', borderRadius: '50px', display: 'inline-block' },
    sideBlind: { flex: 1, opacity: 0.25, textAlign: 'center', padding: '0 20px' },
    sideLabel: { fontSize: '1.1em', color: '#61dafb', marginBottom: '8px' },
    sideValues: { fontSize: '2.2em', fontWeight: 'bold' },
    sideAnte: { fontSize: '0.9em' },
    controls: { marginTop: '40px', display: 'flex', gap: '40px', alignItems: 'center' },
    playButton: { backgroundColor: '#61dafb', border: 'none', borderRadius: '50%', width: '90px', height: '80px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(97, 218, 251, 0.3)' },
    navButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.98)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#161616', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '850px', border: '1px solid #333' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
    tableWrapper: { maxHeight: '50vh', overflowY: 'auto', marginBottom: '25px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#61dafb', padding: '12px', fontSize: '1em', textAlign: 'center', borderBottom: '2px solid #333' },
    td: { padding: '10px', textAlign: 'center', fontSize: '1.1em' },
    input: { backgroundColor: '#222', border: '1px solid #444', color: '#fff', width: '75px', padding: '6px', borderRadius: '5px', textAlign: 'center', fontSize: '1em' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer' },
    modalFooter: { display: 'flex', gap: '15px' },
    addButton: { flex: 1, padding: '15px', backgroundColor: '#61dafb', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1em', fontWeight: 'bold', color: '#000' }
};

export default HomePage;
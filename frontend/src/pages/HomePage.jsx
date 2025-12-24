// src/pages/HomePage.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Importação para navegação
import api from '../services/api';
import { 
    Settings, X, Play, Pause, ChevronLeft, ChevronRight, 
    Trash2, Plus, Save, Coffee, Volume2, VolumeX, TableProperties 
} from 'lucide-react';

function HomePage() {
    const navigate = useNavigate(); // Hook de navegação
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

    const fetchBlinds = useCallback(async (sId) => {
        try {
            const res = await api.get('/session/blinds', {
                headers: { 'X-Session-Id': sId }
            });
            setBlinds(res.data);
            return res.data;
        } catch (err) {
            console.error("Erro ao carregar blinds:", err);
        }
    }, []);

    useEffect(() => {
        let currentSessionId = null;
        const startSession = async () => {
            try {
                setLoading(true);
                const response = await api.post('/session/start');
                const sId = response.data.sessionId;
                currentSessionId = sId;
                setSessionId(sId);
                const fetchedBlinds = response.data.defaultBlinds;
                setBlinds(fetchedBlinds);
                if (fetchedBlinds.length > 0) setTimeLeft(fetchedBlinds[0].duration * 60);
            } catch (err) {
                setError("Erro ao iniciar sessão.");
            } finally {
                setLoading(false);
            }
        };

        startSession();

        const handleUnload = () => {
            if (currentSessionId) {
                fetch('http://localhost:8080/session/end', {
                    method: 'POST',
                    headers: { 'X-Session-Id': currentSessionId, 'Content-Type': 'application/json' },
                    keepalive: true
                });
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            if (currentSessionId) {
                api.post('/session/end', {}, { headers: { 'X-Session-Id': currentSessionId } }).catch(() => {});
            }
        };
    }, []);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    const nextTime = prev - 1;
                    if (isSoundEnabled && nextTime <= 10 && nextTime >= 0) {
                        if (blinds[currentIndex]?.level !== 0) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().catch(() => {});
                            if (nextTime <= 5 && nextTime > 0) {
                                setTimeout(() => {
                                    audioRef.current.currentTime = 0;
                                    audioRef.current.play().catch(() => {});
                                }, 500);
                            }
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
            await fetchBlinds(sessionId);
        } catch (err) { alert("Erro ao adicionar blind"); }
    };

    const handleAddBreak = async () => {
        try {
            await api.post('/breaks/add', {}, { headers: { 'X-Session-Id': sessionId } });
            await fetchBlinds(sessionId);
        } catch (err) { alert("Erro ao adicionar intervalo"); }
    };

    const handleDeleteBlind = async (id) => {
        if (!window.confirm("Deseja deletar?")) return;
        try {
            await api.delete(`/blinds/delete/${id}`, { headers: { 'X-Session-Id': sessionId } });
            await fetchBlinds(sessionId);
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
            const updated = await fetchBlinds(sessionId);
            if (updated[currentIndex]?.id === blind.id) setTimeLeft(parseInt(blind.duration) * 60);
        } catch (err) { alert("Erro ao atualizar blind"); }
    };

    const handleUpdateBreak = async (breakItem) => {
        try {
            const payload = { duration: parseInt(breakItem.duration) };
            await api.put(`/breaks/update/${breakItem.id}`, payload, { headers: { 'X-Session-Id': sessionId } });
            const updated = await fetchBlinds(sessionId);
            if (updated[currentIndex]?.id === breakItem.id) setTimeLeft(parseInt(breakItem.duration) * 60);
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

            {/* Container do Logo e Botão de Tabelas */}
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
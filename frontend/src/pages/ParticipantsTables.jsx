// src/pages/ParticipantsTables.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Loader2, AlertCircle, RefreshCw, Save, XCircle } from 'lucide-react';
import api from '../services/api';

function ParticipantsTables() {
    const navigate = useNavigate();
    
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playerName, setPlayerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingCell, setEditingCell] = useState({ id: null, field: null });
    const [tempValue, setTempValue] = useState('');

    const sessionId = localStorage.getItem('poker_session_id');

    const fetchParticipants = useCallback(async () => {
        if (!sessionId) {
            setError("Sessão não encontrada. Inicie o timer primeiro.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/participants/shows', {
                headers: { 'X-Session-Id': sessionId }
            });
            
            let fetchedParticipants = response.data || [];
            
            fetchedParticipants.sort((a, b) => {
                const posA = a.position ?? 99999;
                const posB = b.position ?? 99999;
                return posA - posB;
            });

            setParticipants(fetchedParticipants);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar participantes:", err);
            setError("Falha ao carregar participantes do servidor.");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    const handleAddParticipant = async (e) => {
        e.preventDefault();
        const trimmedName = playerName.trim();
        if (!trimmedName || !sessionId) return;

        setIsSubmitting(true);
        try {
            await api.post('/participants/create', 
                { player: trimmedName },
                { headers: { 'X-Session-Id': sessionId } }
            );
            setPlayerName('');
            await fetchParticipants();
        } catch (err) {
            console.error("Erro ao criar participante:", err);
            alert("Erro ao adicionar participante. Verifique se o nome já existe ou a conexão.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateParticipant = async (participantId, fieldName, value) => {
        console.log("handleUpdateParticipant chamado com:", { participantId, fieldName, value });

        if (!sessionId) {
            alert("Sessão inválida para atualizar participante.");
            return;
        }
        
        let payloadValue = value;
        if (['buyIn', 'valueRebuy', 'addOn'].includes(fieldName)) {
            payloadValue = parseFloat(value.replace(',', '.')) || 0;
        } else if (['quantityRebuy', 'position'].includes(fieldName)) {
            payloadValue = parseInt(value) || 0;
        } else if (fieldName === 'payment') {
            payloadValue = value.toUpperCase();
        }

        const payload = { [fieldName]: payloadValue };

        try {
            await api.put(`/participants/update/${participantId}`, payload, {
                headers: { 'X-Session-Id': sessionId }
            });
            await fetchParticipants();
        } catch (err) {
            console.error(`Erro ao atualizar ${fieldName} para participante ${participantId}:`, err);
            alert(`Falha ao atualizar ${fieldName}.`);
        } finally {
            setEditingCell({ id: null, field: null });
        }
    };

    const handleDeleteParticipant = async (participantId, playerName) => {
        if (!sessionId) {
            alert("Sessão inválida para deletar participante.");
            return;
        }

        if (!window.confirm(`Tem certeza que deseja deletar o participante ${playerName}?`)) {
            return;
        }

        try {
            await api.delete(`/participants/delete/${participantId}`, {
                headers: { 'X-Session-Id': sessionId }
            });
            await fetchParticipants();
        } catch (err) {
            console.error(`Erro ao deletar participante ${playerName} (ID: ${participantId}):`, err);
            alert(`Falha ao deletar o participante ${playerName}.`);
        }
    };

    const renderEditableCell = (participant, fieldName, type = 'text') => {
        const isCurrentlyEditing = editingCell.id === participant.id && editingCell.field === fieldName;
        const displayValue = String(participant[fieldName] ?? participant[fieldName.replace(/([A-Z])/g, '_$1').toLowerCase()] ?? '');
        
        if (isCurrentlyEditing) {
            if (fieldName === 'payment') {
                return (
                    <select
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={(e) => handleUpdateParticipant(participant.id, fieldName, e.target.value)}
                        style={styles.editableInput}
                        autoFocus
                    >
                        <option value="TRUE">TRUE</option>
                        <option value="FALSE">FALSE</option>
                    </select>
                );
            }
            return (
                <input
                    type={type}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={(e) => handleUpdateParticipant(participant.id, fieldName, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.target.blur();
                        }
                    }}
                    style={styles.editableInput}
                    autoFocus
                />
            );
        }

        return (
            <span onClick={() => {
                setEditingCell({ id: participant.id, field: fieldName });
                setTempValue(displayValue);
            }} style={{ cursor: 'pointer' }}>
                {displayValue}
            </span>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <button onClick={() => navigate('/')} style={styles.backButton}>
                    <ArrowLeft size={20} /> VOLTAR AO TIMER
                </button>
                <button onClick={fetchParticipants} style={styles.refreshBtn} title="Atualizar Tabela">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            
            <h1 style={styles.title}>TABELAS DOS PARTICIPANTES</h1>

            {!sessionId && (
                <div style={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>SESSÃO INVÁLIDA: VOLTE AO INÍCIO E INICIE O TIMER.</span>
                </div>
            )}

            <form onSubmit={handleAddParticipant} style={styles.formContainer}>
                <input 
                    type="text" 
                    placeholder="NOME DO JOGADOR" 
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                    style={styles.input}
                    disabled={isSubmitting || !sessionId}
                />
                <button 
                    type="submit" 
                    style={sessionId ? styles.addButton : styles.disabledButton} 
                    disabled={isSubmitting || !sessionId}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                    ADICIONAR
                </button>
            </form>
            
            <div style={styles.tableWrapper}>
                {loading && participants.length === 0 ? (
                    <p style={styles.statusText}>Sincronizando com o servidor...</p>
                ) : error ? (
                    <p style={{...styles.statusText, color: '#ff4444'}}>{error}</p>
                ) : participants.length === 0 ? (
                    <p style={styles.statusText}>Nenhum jogador na mesa.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>POS</th>
                                <th style={styles.th}>JOGADOR</th>
                                <th style={styles.th}>BUY-IN</th>
                                <th style={styles.th}>REBUYS (QTD)</th>
                                <th style={styles.th}>REBUYS (VAL)</th>
                                <th style={styles.th}>REBUYS (TOTAL)</th>
                                <th style={styles.th}>ADD-ON</th>
                                <th style={styles.th}>TOTAL</th>
                                <th style={styles.th}>PAGAMENTO</th>
                                <th style={styles.th}>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((p) => (
                                <tr key={p.id} style={styles.tr}>
                                    <td style={styles.td}>{renderEditableCell(p, 'position', 'number')}º</td>
                                    <td style={{...styles.td, color: '#61dafb', fontWeight: 'bold'}}>
                                        {renderEditableCell(p, 'player')}
                                    </td>
                                    <td style={styles.td}>R$ {renderEditableCell(p, 'buyIn', 'number')}</td>
                                    <td style={styles.td}>{renderEditableCell(p, 'quantityRebuy', 'number')}</td>
                                    <td style={styles.td}>R$ {renderEditableCell(p, 'valueRebuy', 'number')}</td>
                                    <td style={styles.td}>R$ {p.total_rebuy || p.totalRebuy || '0,00'}</td> 
                                    <td style={styles.td}>R$ {renderEditableCell(p, 'addOn', 'number')}</td>
                                    <td style={{...styles.td, fontWeight: 'bold', color: '#00ff00'}}>
                                        R$ {p.total_player || p.totalPlayer || '0,00'}
                                    </td>
                                    <td style={styles.td}>{renderEditableCell(p, 'payment', 'select')}</td>
                                    <td style={styles.td}>
                                        <button 
                                            onClick={() => handleDeleteParticipant(p.id, p.player)}
                                            style={styles.actionButton}
                                        >
                                            <XCircle size={18} color="#ff6b6b" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', fontFamily: '"Courier New", Courier, monospace', padding: '40px' },
    headerRow: { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' },
    backButton: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'transparent', border: '1px solid #61dafb', color: '#61dafb', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em', fontWeight: 'bold', marginBottom: '40px' },
    refreshBtn: { backgroundColor: 'transparent', border: 'none', color: '#61dafb', cursor: 'pointer', padding: '10px' },
    title: { fontSize: '2.5em', color: '#61dafb', letterSpacing: '4px', margin: '0 0 30px 0' },
    errorBanner: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#441111', color: '#ff4444', padding: '15px', borderRadius: '5px', marginBottom: '20px', width: '100%', border: '1px solid #ff4444', fontSize: '0.8em', fontWeight: 'bold' },
    formContainer: { display: 'flex', gap: '15px', marginBottom: '40px', width: '100%', maxWidth: '600px' },
    input: { flex: 1, backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none', fontSize: '1em' },
    addButton: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#61dafb', border: 'none', color: '#000', padding: '0 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    disabledButton: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#333', border: 'none', color: '#666', padding: '0 25px', borderRadius: '4px', cursor: 'not-allowed', fontWeight: 'bold' },
    tableWrapper: { width: '100%', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85em' },
    th: { borderBottom: '2px solid #333', padding: '15px 10px', color: '#666', textTransform: 'uppercase' },
    td: { padding: '10px', borderBottom: '1px solid #222', verticalAlign: 'middle' },
    tr: { borderBottom: '1px solid #222' },
    statusText: { color: '#666', fontStyle: 'italic' },
    editableInput: {
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        padding: '5px 8px',
        borderRadius: '3px',
        width: 'auto',
        minWidth: '50px',
        maxWidth: '100px',
        fontSize: '1em',
        fontFamily: 'inherit'
    },
    actionButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px'
    }
};

export default ParticipantsTables;
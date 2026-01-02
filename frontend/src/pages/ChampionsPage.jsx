// src/pages/ChampionsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import api from '../services/api';

function ChampionsPage() {
    const navigate = useNavigate();
    const [champions, setChampions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sessionId = localStorage.getItem('poker_session_id');

    useEffect(() => {
        const fetchChampions = async () => {
            if (!sessionId) {
                setError("Sessão não encontrada. Retornando para o início.");
                setLoading(false);
                setTimeout(() => navigate('/'), 2000);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get('/participants/champions', {
                    headers: { 'X-Session-Id': sessionId }
                });
                const sortedChampions = response.data.sort((a, b) => a.position - b.position);
                setChampions(sortedChampions);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar campeões:", err);
                setError("Falha ao carregar o pódio. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchChampions();
    }, [sessionId, navigate]);

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '0,00';
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '0,00';
        return numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <button 
                    onClick={() => navigate('/')} 
                    style={styles.backButton}
                >
                    <ArrowLeft size={20} /> VOLTAR AO TIMER
                </button>
            </div>
            
            <h1 style={styles.title}><Trophy size={40} color="#FFD700" /> PÓDIO DOS CAMPEÕES <Trophy size={40} color="#FFD700" /></h1>

            {loading ? (
                <p style={styles.statusText}>Carregando campeões...</p>
            ) : error ? (
                <p style={{...styles.statusText, color: '#ff4444'}}>{error}</p>
            ) : champions.length === 0 ? (
                <p style={styles.statusText}>Nenhum campeão encontrado para esta sessão.</p>
            ) : (
                <div style={styles.podiumContainer}>
                    {/* 2º Lugar */}
                    {champions[1] && (
                        <div style={{...styles.podiumStep, ...styles.secondPlace}}>
                            <span style={styles.placeNumber}>2º</span>
                            <h2 style={styles.playerName}>{champions[1].player}</h2>
                            {champions[1].totalPlayer && <p style={styles.playerTotal}>R$ {formatCurrency(champions[1].totalPlayer)}</p>}
                        </div>
                    )}
                    {/* 1º Lugar */}
                    {champions[0] && (
                        <div style={{...styles.podiumStep, ...styles.firstPlace}}>
                            <span style={styles.placeNumber}>1º</span>
                            <h2 style={styles.playerName}>{champions[0].player}</h2>
                            {champions[0].totalPlayer && <p style={styles.playerTotal}>R$ {formatCurrency(champions[0].totalPlayer)}</p>}
                        </div>
                    )}
                    {/* 3º Lugar */}
                    {champions[2] && (
                        <div style={{...styles.podiumStep, ...styles.thirdPlace}}>
                            <span style={styles.placeNumber}>3º</span>
                            <h2 style={styles.playerName}>{champions[2].player}</h2>
                            {champions[2].totalPlayer && <p style={styles.playerTotal}>R$ {formatCurrency(champions[2].totalPlayer)}</p>}
                        </div>
                    )}
                </div>
            )}
            
            {/* O botão "INICIAR NOVA PARTIDA" foi removido daqui */}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#fff',
        fontFamily: '"Courier New", Courier, monospace',
        padding: '40px',
        fontSize: '1.2em'
    },
    headerRow: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        width: 'auto'
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'transparent',
        border: '1px solid #61dafb',
        color: '#61dafb',
        padding: '12px 25px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s, color 0.3s'
    },
    title: {
        fontSize: '3.5em',
        color: '#FFD700',
        letterSpacing: '4px',
        margin: '0 0 50px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    statusText: {
        color: '#ccc',
        fontStyle: 'italic',
        fontSize: '1.5em'
    },
    podiumContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '900px',
        marginTop: '50px'
    },
    podiumStep: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        padding: '20px 10px',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        position: 'relative',
        width: '30%',
        minWidth: '150px'
    },
    firstPlace: {
        height: '300px',
        backgroundColor: '#333',
        borderBottom: '5px solid #FFD700',
        transform: 'scale(1.1)',
        zIndex: 2,
        marginBottom: '20px'
    },
    secondPlace: {
        height: '220px',
        backgroundColor: '#2a2a2a',
        borderBottom: '5px solid #C0C0C0',
        zIndex: 1
    },
    thirdPlace: {
        height: '180px',
        backgroundColor: '#2a2a2a',
        borderBottom: '5px solid #CD7F32',
        zIndex: 1
    },
    placeNumber: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#fff'
    },
    playerName: {
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#61dafb',
        textAlign: 'center',
        marginBottom: '5px'
    },
    playerTotal: {
        fontSize: '1.2em',
        color: '#00ff00',
        textAlign: 'center'
    }
};

export default ChampionsPage;
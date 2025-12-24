// src/pages/ParticipantsTables.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function ParticipantsTables() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <button 
                onClick={() => navigate('/')} 
                style={styles.backButton}
            >
                <ArrowLeft size={20} /> VOLTAR AO TIMER
            </button>
            
            <h1 style={styles.title}>TABELAS DOS PARTICIPANTES</h1>
            
            <div style={styles.contentPlaceholder}>
                <p>Conteúdo das tabelas em desenvolvimento...</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#fff',
        fontFamily: '"Courier New", Courier, monospace',
        padding: '40px'
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'transparent',
        border: '1px solid #61dafb',
        color: '#61dafb',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        fontWeight: 'bold',
        marginBottom: '40px'
    },
    title: {
        fontSize: '2.5em',
        color: '#61dafb',
        letterSpacing: '4px',
        margin: 0
    },
    contentPlaceholder: {
        marginTop: '40px',
        padding: '20px',
        border: '1px dashed #333',
        width: '100%',
        textAlign: 'center',
        color: '#666'
    }
};

export default ParticipantsTables;
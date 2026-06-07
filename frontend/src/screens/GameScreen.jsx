import React, { useEffect } from "react";

const GameScreen = () => {
    useEffect(() => {
        const gameWindow = window.open(
            'http://localhost:8080',
            '_blank',
            'width=' + window.screen.width + ',height=' + window.screen.height
        );
    }, []);

    return (
        <div style={{ 
            width: '100%', 
            height: '100vh', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            color: '#fff'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Igra se otvara u novom prozoru...</h2>
                <button 
                    onClick={() => window.open('http://localhost:8080', '_blank')}
                    style={{
                        marginTop: '20px',
                        padding: '10px 30px',
                        fontSize: '18px',
                        cursor: 'pointer'
                    }}
                >
                    Otvori igru ponovo
                </button>
            </div>
        </div>
    );
};

export default GameScreen;
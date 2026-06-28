import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";

const GameScreen = () => { 
        const navigate = useNavigate();

        const handleStartGame = () => {
        const gameWindow = window.open(
            'http://localhost:8080',
            'gameWindow',
            'width=' + window.screen.width + ',height=' + window.screen.height
        );

       
        setTimeout(() => {
            const playerId = localStorage.getItem('playerId');
            if (gameWindow && playerId) {
                gameWindow.postMessage({ playerId }, 'http://localhost:8080');
            }
        }, 2000);
    };
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
                   onClick={() => window.open(
                      'http://localhost:8080',
                       'gameWindow',
                       'width=' + window.screen.width + ',height=' + window.screen.height
                    )}
                    style={{
                        marginTop: '20px',
                        padding: '10px 30px',
                        fontSize: '18px',
                        cursor: 'pointer'
                    }}
                >
                    Otvori igru ponovo
                </button>
                <button 
            onClick={() => navigate('/')}
             style={{
            marginTop: '10px',
            padding: '10px 30px',
             fontSize: '18px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
             color: '#fff',
            border: '1px solid #fff'
            }}
>           Back to Menu
            </button>
            </div>
        </div>
    );
};

export default GameScreen;
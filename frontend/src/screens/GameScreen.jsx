import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const GameScreen = () => {
    const navigate = useNavigate();
    const gameWindowRef = useRef(null);

    // Slušamo poruke od igre (:8080). Kad igra zatraži playerId, pošaljemo joj ga.
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== "http://localhost:8080") return;

            if (event.data?.type === "REQUEST_PLAYER_ID") {
                const playerId = localStorage.getItem("playerId");
                if (gameWindowRef.current && playerId) {
                    gameWindowRef.current.postMessage({ playerId }, "http://localhost:8080");
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const openGame = () => {
        gameWindowRef.current = window.open(
            "http://localhost:8080",
            "gameWindow",
            "width=" + window.screen.width + ",height=" + window.screen.height
        );
    };

    // Otvori igru automatski kad se ekran učita
    useEffect(() => {
        openGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000",
                color: "#fff",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <h2>Igra se otvara u novom prozoru...</h2>
                <button
                    onClick={openGame}
                    style={{
                        marginTop: "20px",
                        padding: "10px 30px",
                        fontSize: "18px",
                        cursor: "pointer",
                    }}
                >
                    Otvori igru ponovo
                </button>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        marginTop: "10px",
                        padding: "10px 30px",
                        fontSize: "18px",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        color: "#fff",
                        border: "1px solid #fff",
                    }}
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
};

export default GameScreen;
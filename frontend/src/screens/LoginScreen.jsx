import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/notes/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('playerId', data.id);
                localStorage.setItem('playerName', name);
                localStorage.setItem('playerRole', data.role);
                navigate('/');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Server error, try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h1 style={styles.title}>Login</h1>
                <p style={styles.subtitle}>Enter the galaxy, pilot</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>PILOT NAME</label>
                        <input style={styles.input} type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..." required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>PASSWORD</label>
                        <input style={styles.input} type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password..." required />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'LAUNCHING...' : 'LAUNCH →'}
                    </button>
                </form>

                <p style={styles.switchText}>
                    No account? <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Courier New', monospace",
    },
    card: {
        background: 'rgba(10, 20, 50, 0.85)',
        border: '1px solid rgba(100, 180, 255, 0.3)',
        borderRadius: '4px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 0 60px rgba(80, 150, 255, 0.15)',
    },
    title: {
        color: '#4fc3f7',
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '0.3em',
        marginBottom: '4px',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(79,195,247,0.6)',
    },
    subtitle: {
        color: 'rgba(150,200,255,0.5)',
        textAlign: 'center',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        marginBottom: '36px',
        textTransform: 'uppercase',
    },
    errorBox: {
        background: 'rgba(255, 80, 80, 0.15)',
        border: '1px solid rgba(255,80,80,0.4)',
        color: '#ff8080',
        padding: '10px 16px',
        borderRadius: '3px',
        fontSize: '0.8rem',
        marginBottom: '20px',
        textAlign: 'center',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { color: 'rgba(100,180,255,0.7)', fontSize: '0.65rem', letterSpacing: '0.2em' },
    input: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(100,180,255,0.25)',
        borderRadius: '3px',
        padding: '12px 16px',
        color: '#e0f0ff',
        fontSize: '0.9rem',
        fontFamily: "'Courier New', monospace",
        outline: 'none',
    },
    button: {
        marginTop: '8px',
        background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
        border: '1px solid rgba(79,195,247,0.5)',
        borderRadius: '3px',
        color: '#4fc3f7',
        padding: '14px',
        fontSize: '0.85rem',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        letterSpacing: '0.2em',
        cursor: 'pointer',
    },
    switchText: { textAlign: 'center', marginTop: '24px', color: 'rgba(150,200,255,0.5)', fontSize: '0.8rem' },
    link: { color: '#4fc3f7', textDecoration: 'none', fontWeight: 'bold' },
};

export default LoginScreen;
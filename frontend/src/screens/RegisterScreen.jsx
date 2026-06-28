import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterScreen = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/notes/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account created! You can now log in.');
                navigate('/login');
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
                <h1 style={styles.title}>🚀 REGISTER</h1>
                <p style={styles.subtitle}>Create your pilot profile</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>PILOT NAME</label>
                        <input style={styles.input} type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Choose your pilot name..." required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>PASSWORD</label>
                        <input style={styles.input} type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password..." required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>CONFIRM PASSWORD</label>
                        <input style={styles.input} type="password" value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Repeat your password..." required />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'CREATING...' : 'CREATE ACCOUNT →'}
                    </button>
                </form>

                <p style={styles.switchText}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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
        border: '1px solid rgba(180, 150, 255, 0.3)',
        borderRadius: '4px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 0 60px rgba(150, 80, 255, 0.15)',
    },
    title: {
        color: '#b39ddb',
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '0.3em',
        marginBottom: '4px',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(179,157,219,0.6)',
    },
    subtitle: {
        color: 'rgba(180,150,255,0.5)',
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
    label: { color: 'rgba(180,150,255,0.7)', fontSize: '0.65rem', letterSpacing: '0.2em' },
    input: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(180,150,255,0.25)',
        borderRadius: '3px',
        padding: '12px 16px',
        color: '#e0d0ff',
        fontSize: '0.9rem',
        fontFamily: "'Courier New', monospace",
        outline: 'none',
    },
    button: {
        marginTop: '8px',
        background: 'linear-gradient(135deg, #4a148c, #311b92)',
        border: '1px solid rgba(179,157,219,0.5)',
        borderRadius: '3px',
        color: '#b39ddb',
        padding: '14px',
        fontSize: '0.85rem',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        letterSpacing: '0.2em',
        cursor: 'pointer',
    },
    switchText: { textAlign: 'center', marginTop: '24px', color: 'rgba(180,150,255,0.5)', fontSize: '0.8rem' },
    link: { color: '#b39ddb', textDecoration: 'none', fontWeight: 'bold' },
};

export default RegisterScreen;
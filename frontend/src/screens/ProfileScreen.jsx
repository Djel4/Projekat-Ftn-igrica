import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
    const navigate = useNavigate();
    const playerId = localStorage.getItem('playerId');

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

  //ucitava podatke od korisnika
    useEffect(() => {
        if (!playerId) {
            navigate('/login');
            return;
        }

        const loadProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/notes/${playerId}`, {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setName(data.name || '');
                } else {
                    setError(data.message || 'Could not load profile.');
                }
            } catch (err) {
                setError('Server error, try again later. (blame dev for that)');
            } finally {
                setFetching(false);
            }
        };

        loadProfile();
    }, [playerId, navigate]);

    //za update izmena i njihovo cuvanje 
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            //salje se lozinka samo ako je korisnik nesto uneo 
            const body = { name };
            if (password.trim()) body.password = password;

            const response = await fetch(`http://localhost:5001/api/notes/${playerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('playerName', name);
                setPassword('');
                setSuccess('Profile updated successfully. Happy flying');
            } else {
                setError(data.message || 'Update failed. Planet needs you, try again');
            }
        } catch (err) {
            setError('Server error, try again later. No fuel left for ship blame inflation');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('playerId');
        localStorage.removeItem('playerName');
        navigate('/login');
    };

    if (fetching) {
        return (
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    <p style={styles.subtitle}>Loading profile</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h1 style={styles.title}>Profile</h1>
                <p style={styles.subtitle}>Edit your pilot data commander</p>

                {error && <div style={styles.errorBox}>{error}</div>}
                {success && <div style={styles.successBox}>{success}</div>}

                <form onSubmit={handleUpdate} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>PILOT NAME</label>
                        <input style={styles.input} type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name..." required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>NEW PASSWORD</label>
                        <input style={styles.input} type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave empty to keep current..." />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                </form>

                <button style={styles.logoutButton} onClick={handleLogout}>
                    LOG OUT
                </button>
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
    successBox: {
        background: 'rgba(80, 255, 140, 0.12)',
        border: '1px solid rgba(80,255,140,0.4)',
        color: '#7dffb0',
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
    logoutButton: {
        marginTop: '16px',
        width: '100%',
        background: 'transparent',
        border: '1px solid rgba(255,80,80,0.4)',
        borderRadius: '3px',
        color: '#ff8080',
        padding: '12px',
        fontSize: '0.75rem',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        letterSpacing: '0.2em',
        cursor: 'pointer',
    },
    switchText: { textAlign: 'center', marginTop: '24px', color: 'rgba(150,200,255,0.5)', fontSize: '0.8rem' },
    link: { color: '#4fc3f7', textDecoration: 'none', fontWeight: 'bold' },
};

export default ProfileScreen;
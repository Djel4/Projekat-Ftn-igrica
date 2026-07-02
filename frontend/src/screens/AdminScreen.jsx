import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminScreen = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('playerRole');
    const myId = localStorage.getItem('playerId');

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // dozvoli pristup samo adminu
    useEffect(() => {
        if (role !== 'admin') {
            navigate('/');
            return;
        }
        loadUsers();
       
    }, []);

    const loadUsers = async () => {
        setError('');
        try {
            const response = await fetch('http://localhost:5001/api/notes/', {
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                setError(data.message || 'Could not load users.');
            }
        } catch (err) {
            setError('Server error, try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete account "${name}"? This cannot be undone.`)) {
            return;
        }
        setMessage('');
        setError('');
        try {
            const response = await fetch(`http://localhost:5001/api/notes/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(`Account "${name}" is deleted from galaxy.`);
                await loadUsers();
            } else {
                setError(data.message || 'Could not delete user.');
            }
        } catch (err) {
            setError('Server error, try again later.');
        }
    };

    if (loading) {
        return (
            <div style={styles.wrapper}>
                <p style={styles.subtitle}>Loading users...</p>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <h1 style={styles.title}>ADMIN PANEL</h1>
            <p style={styles.subtitle}>Manage all pilots</p>

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.tableWrap}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Score</th>
                            <th style={styles.th}>Coins</th>
                            <th style={styles.th}>Skins</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td style={styles.td}>{u.name}</td>
                                <td style={styles.td}>
                                    <span style={u.role === 'admin' ? styles.adminBadge : styles.userBadge}>
                                        {u.role || 'user'}
                                    </span>
                                </td>
                                <td style={styles.td}>{u.score ?? 0}</td>
                                <td style={styles.td}>{u.coins ?? 0}</td>
                                <td style={styles.td}>{u.skins ? u.skins.length : 0}</td>
                                <td style={styles.td}>
                                    {u._id === myId ? (
                                        <span style={styles.you}>YOU</span>
                                    ) : (
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDelete(u._id, u.name)}
                                        >
                                            DELETE
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '80vh',
        padding: '40px 20px',
        fontFamily: "'Courier New', monospace",
        maxWidth: '900px',
        margin: '0 auto',
    },
    title: {
        color: '#4fc3f7',
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '0.3em',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(79,195,247,0.6)',
        marginBottom: '4px',
    },
    subtitle: {
        color: 'rgba(150,200,255,0.5)',
        textAlign: 'center',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        marginBottom: '30px',
        textTransform: 'uppercase',
    },
    tableWrap: {
        background: 'rgba(10, 20, 50, 0.85)',
        border: '1px solid rgba(100, 180, 255, 0.3)',
        borderRadius: '6px',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: '#e0f0ff',
        fontSize: '0.85rem',
    },
    th: {
        textAlign: 'left',
        padding: '14px 16px',
        color: 'rgba(100,180,255,0.8)',
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        borderBottom: '1px solid rgba(100,180,255,0.25)',
        textTransform: 'uppercase',
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid rgba(100,180,255,0.1)',
    },
    adminBadge: {
        color: '#ffd54f',
        border: '1px solid rgba(255,213,79,0.4)',
        borderRadius: '3px',
        padding: '2px 8px',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
    },
    userBadge: {
        color: 'rgba(150,200,255,0.7)',
        border: '1px solid rgba(150,200,255,0.3)',
        borderRadius: '3px',
        padding: '2px 8px',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
    },
    deleteButton: {
        background: 'transparent',
        border: '1px solid rgba(255,80,80,0.5)',
        borderRadius: '3px',
        color: '#ff8080',
        padding: '6px 14px',
        fontSize: '0.7rem',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        cursor: 'pointer',
    },
    you: {
        color: 'rgba(125,255,176,0.8)',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
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
};

export default AdminScreen;
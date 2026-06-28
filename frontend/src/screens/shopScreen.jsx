import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// key MORA biti isti kao u SKIN_PRICES (backend) i PLANET_SKINS (igra).
const SKINS = [
    { key: 'brownie',        label: 'Brownie',         price: 100,  image: 'http://localhost:8080/assets/images/skins/brownie.png' },
    { key: 'coal',           label: 'Coal',            price: 100,  image: 'http://localhost:8080/assets/images/skins/coal.png' },
    { key: 'darkcookie',     label: 'Dark Cookie',     price: 150,  image: 'http://localhost:8080/assets/images/skins/darkcookie.png' },
    { key: 'cookielight',    label: 'Cookie Light',    price: 150,  image: 'http://localhost:8080/assets/images/skins/cookieLigth.png' },
    { key: 'coktel',         label: 'Coktel',          price: 200,  image: 'http://localhost:8080/assets/images/skins/coktel.png' },
    { key: 'ice',            label: 'Ice',             price: 200,  image: 'http://localhost:8080/assets/images/skins/ice.png' },
    { key: 'snow',           label: 'Snow',            price: 250,  image: 'http://localhost:8080/assets/images/skins/snow.png' },
    { key: 'lime',           label: 'Lime',            price: 250,  image: 'http://localhost:8080/assets/images/skins/lime.png' },
    { key: 'purple',         label: 'Purple',          price: 300,  image: 'http://localhost:8080/assets/images/skins/purple.png' },
    { key: 'fishy',          label: 'Fishy',           price: 300,  image: 'http://localhost:8080/assets/images/skins/fishy.png' },
    { key: 'fakeearth',      label: 'Fake Earth',      price: 500,  image: 'http://localhost:8080/assets/images/skins/fakeEarth.png' },
    { key: 'snowstorm',      label: 'Snow Storm',      price: 500,  image: 'http://localhost:8080/assets/images/skins/snowStorm.png' },
    { key: 'corrupted',      label: 'Corrupted',       price: 800,  image: 'http://localhost:8080/assets/images/skins/corrupted.png' },
    { key: 'crainginvasion', label: 'Craing Invasion', price: 1000, image: 'http://localhost:8080/assets/images/skins/craingInvasion.png' },
    { key: 'void',           label: 'Void',            price: 1500, image: 'http://localhost:8080/assets/images/skins/void.png' },
];

const ShopScreen = () => {
    const navigate = useNavigate();
    const playerId = localStorage.getItem('playerId');

    const [coins, setCoins] = useState(0);
    const [owned, setOwned] = useState([]);
    const [currentSkin, setCurrentSkin] = useState('defaultSkin');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/notes/${playerId}`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setCoins(data.coins || 0);
                setOwned(data.skins || []);
                setCurrentSkin(data.currentSkin || 'defaultSkin');
            } else {
                setError(data.message || 'Could not load shop.');
            }
        } catch (err) {
            setError('Server error, try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!playerId) {
            navigate('/login');
            return;
        }
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerId]);

    const handleBuy = async (skinKey) => {
        setMessage('');
        setError('');
        try {
            const response = await fetch(`http://localhost:5001/api/notes/${playerId}/skins/buy`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ skin: skinKey }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Skin bought!');
                await loadData();
            } else {
                setError(data.message || 'Could not buy skin.');
            }
        } catch (err) {
            setError('Server error, try again later.');
        }
    };

    const handleEquip = async (skinKey) => {
        setMessage('');
        setError('');
        try {
            const response = await fetch(`http://localhost:5001/api/notes/${playerId}/skins/active`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ skin: skinKey }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Skin equipped!');
                await loadData();
            } else {
                setError(data.message || 'Could not equip skin.');
            }
        } catch (err) {
            setError('Server error, try again later.');
        }
    };

    const handleUnequip = async () => {
        setMessage('');
        setError('');
        try {
            const response = await fetch(`http://localhost:5001/api/notes/${playerId}/skins/unequip`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Skin unequipped!');
                await loadData();
            } else {
                setError(data.message || 'Could not unequip skin.');
            }
        } catch (err) {
            setError('Server error, try again later.');
        }
    };

    if (loading) {
        return (
            <div style={styles.wrapper}>
                <p style={styles.subtitle}>Loading shop...</p>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <h1 style={styles.title}>SHOP</h1>
                <div style={styles.coins}>🪙 {coins} coins</div>
            </div>

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.grid}>
                {SKINS.map((skin) => {
                    const isOwned = owned.includes(skin.key);
                    const isEquipped = currentSkin === skin.key;
                    const canAfford = coins >= skin.price;

                    return (
                        <div key={skin.key} style={styles.card}>
                            <img src={skin.image} alt={skin.label} style={styles.skinImage} />
                            <div style={styles.skinName}>{skin.label}</div>

                            {!isOwned && (
                                <div style={styles.price}>🪙 {skin.price}</div>
                            )}

                            {isEquipped ? (
                                <>
                                    <div style={styles.equipped}>EQUIPPED</div>
                                    <button style={styles.unequipButton} onClick={handleUnequip}>
                                        UNEQUIP
                                    </button>
                                </>
                            ) : isOwned ? (
                                <button style={styles.equipButton} onClick={() => handleEquip(skin.key)}>
                                    SELECT
                                </button>
                            ) : (
                                <button
                                    style={{ ...styles.buyButton, opacity: canAfford ? 1 : 0.4, cursor: canAfford ? 'pointer' : 'not-allowed' }}
                                    onClick={() => canAfford && handleBuy(skin.key)}
                                    disabled={!canAfford}
                                >
                                    {canAfford ? 'BUY' : 'NOT ENOUGH'}
                                </button>
                            )}
                        </div>
                    );
                })}
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    title: {
        color: '#4fc3f7',
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '0.3em',
        textShadow: '0 0 20px rgba(79,195,247,0.6)',
        margin: 0,
    },
    coins: {
        color: '#ffd54f',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px',
    },
    card: {
        background: 'rgba(10, 20, 50, 0.85)',
        border: '1px solid rgba(100, 180, 255, 0.3)',
        borderRadius: '6px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 0 30px rgba(80, 150, 255, 0.1)',
    },
    skinImage: {
        width: '100px',
        height: '100px',
        objectFit: 'contain',
        marginBottom: '12px',
    },
    skinName: {
        color: '#e0f0ff',
        fontSize: '1rem',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        marginBottom: '8px',
    },
    price: {
        color: '#ffd54f',
        fontSize: '0.9rem',
        marginBottom: '12px',
    },
    buyButton: {
        width: '100%',
        background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
        border: '1px solid rgba(79,195,247,0.5)',
        borderRadius: '3px',
        color: '#4fc3f7',
        padding: '10px',
        fontSize: '0.8rem',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        letterSpacing: '0.15em',
    },
    equipButton: {
        width: '100%',
        background: 'transparent',
        border: '1px solid rgba(79,195,247,0.5)',
        borderRadius: '3px',
        color: '#4fc3f7',
        padding: '10px',
        fontSize: '0.8rem',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        letterSpacing: '0.15em',
        cursor: 'pointer',
    },
    equipped: {
        color: '#7dffb0',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        letterSpacing: '0.15em',
        padding: '10px',
        border: '1px solid rgba(125,255,176,0.4)',
        borderRadius: '3px',
    },
    unequipButton: {
        width: '100%',
        marginTop: '8px',
        background: 'transparent',
        border: '1px solid rgba(255,150,80,0.5)',
        borderRadius: '3px',
        color: '#ffb060',
        padding: '8px',
        fontSize: '0.75rem',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        letterSpacing: '0.15em',
        cursor: 'pointer',
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
    subtitle: {
        color: 'rgba(150,200,255,0.5)',
        textAlign: 'center',
        letterSpacing: '0.2em',
    },
};

export default ShopScreen;
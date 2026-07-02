import React, { useState, useEffect } from 'react';
const NASA_API_KEY = '18nb4gcwPYPBwLH4VDR4GQydCoADJssSLfRHvqD6'; //moj licni key

const AsteroidsScreen = () => {
    const [asteroids, setAsteroids] = useState([]);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // useEffect sa [] na kraju = izvrsava se JEDNOM, kad se ekran otvori
    useEffect(() => {
        const fetchAsteroids = async () => {
            //za danasnji datum
            const today = new Date().toISOString().split('T')[0];
            setDate(today);

            try {
                // poziva nasin ip
                const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                // ako vrati gresku
                if (!response.ok) {
                    setError(data.error?.message || 'Could not load asteroid data.');
                    return;
                }

                //NASA vraca asteroide grupisane po datumu
                //    pa uzimamo lista za danasnji datum
                const list = data.near_earth_objects[today] || [];

                // iz svakog asteroida izvlacimo samo ono sto nam treba
               
                const parsed = list.map((a) => {
                    const approach = a.close_approach_data[0]; // podaci o priblizavanju
                    return {
                        id: a.id,
                        // ime dolazi kao 2024 AB1 pa se sklanjaju zagrade
                        name: a.name.replace(/[()]/g, ''),
                        // da li je potencijalno opasan
                        hazardous: a.is_potentially_hazardous_asteroid,
                        // najveci procenjeni precnik u metrima
                        diameterMax: Math.round(a.estimated_diameter.meters.estimated_diameter_max),
                        // brzina priblizavanja u km/h
                        velocity: Math.round(approach?.relative_velocity?.kilometers_per_hour || 0),
                        // koliko ce omasiti zemlju
                        missKm: Math.round(approach?.miss_distance?.kilometers || 0),
                    };
                })
                //sortira po velicini
                .sort((x, y) => y.diameterMax - x.diameterMax);

                setAsteroids(parsed);
            } catch (err) {
                // greska u mrezi
                setError('Server error, try again later.');
            } finally {
                // u svakom slucaju sklanjamo "loading"
                setLoading(false);
            }
        };

        fetchAsteroids();
    }, []);

   
    return (
        <div style={styles.wrapper}>
            <h1 style={styles.title}>NEAR-EARTH ASTEROIDS</h1>
            <p style={styles.subtitle}>
                Live data from NASA {date && `· ${date}`}
            </p>

            
            {loading && <p style={styles.info}>Scanning the skies...</p>}

          
            {error && <div style={styles.errorBox}>{error}</div>}

         
            {!loading && !error && (
                <>
                   
                    <p style={styles.count}>
                        {asteroids.length} objects tracked today ·{' '}
                        <span style={{ color: '#ff8080' }}>
                            {asteroids.filter((a) => a.hazardous).length} potentially hazardous
                        </span>
                    </p>

               
                    <div style={styles.grid}>
                        {asteroids.map((a) => (
                            <div
                                key={a.id}
                                style={{
                                    ...styles.card,
                                    // opasni asteroidi dobijaju crveni okvir
                                    borderColor: a.hazardous ? 'rgba(255,80,80,0.5)' : 'rgba(100,180,255,0.3)',
                                }}
                            >
                                <div style={styles.cardHeader}>
                                    <span style={styles.rock}>🪨</span>
                                    <span style={styles.name}>{a.name}</span>
                                </div>

                               
                                {a.hazardous && <div style={styles.hazard}>HAZARDOUS DANGER</div>}

                                <div style={styles.row}>
                                    <span style={styles.rowLabel}>Diameter</span>
                                    <span style={styles.rowValue}>~{a.diameterMax} m</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.rowLabel}>Speed</span>
                                    <span style={styles.rowValue}>{a.velocity.toLocaleString()} km/h</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.rowLabel}>Miss distance</span>
                                    <span style={styles.rowValue}>{a.missKm.toLocaleString()} km</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '80vh',
        padding: '40px 20px',
        fontFamily: "'Courier New', monospace",
        maxWidth: '1000px',
        margin: '0 auto',
    },
    title: {
        color: '#4fc3f7',
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '0.25em',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(79,195,247,0.6)',
        marginBottom: '4px',
    },
    subtitle: {
        color: 'rgba(150,200,255,0.5)',
        textAlign: 'center',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        marginBottom: '24px',
        textTransform: 'uppercase',
    },
    count: {
        color: 'rgba(200,220,255,0.7)',
        textAlign: 'center',
        fontSize: '0.85rem',
        marginBottom: '30px',
    },
    info: {
        color: 'rgba(150,200,255,0.6)',
        textAlign: 'center',
        letterSpacing: '0.2em',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '18px',
    },
    card: {
        background: 'rgba(10, 20, 50, 0.85)',
        border: '1px solid rgba(100, 180, 255, 0.3)',
        borderRadius: '6px',
        padding: '18px',
        boxShadow: '0 0 30px rgba(80, 150, 255, 0.1)',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
    },
    rock: { fontSize: '1.2rem' },
    name: {
        color: '#e0f0ff',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
    },
    hazard: {
        color: '#ff8080',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        marginBottom: '10px',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 0',
        borderBottom: '1px solid rgba(100,180,255,0.1)',
    },
    rowLabel: {
        color: 'rgba(100,180,255,0.7)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
    },
    rowValue: {
        color: '#e0f0ff',
        fontSize: '0.78rem',
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

export default AsteroidsScreen;
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';

const LeaderboardScreen = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/notes/leaderboard');
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <Container className="mt-5">
            <h1 className="text-center fw-bold mb-4">🏆 LEADERBOARD</h1>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player, index) => (
                            <tr key={player._id}>
                                <td>{index + 1}</td>
                                <td>{player.name}</td>
                                <td>{player.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default LeaderboardScreen;
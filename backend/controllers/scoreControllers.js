import Note from "../models/Note.js";

export async function getLeaderBoard(_, res) {
    try {
        const topPlayer = await Note.find().sort({ score: -1 }).limit(10).select("name score");
        res.status(200).json(topPlayer);
    } catch (error) {
        console.error("Error in getLeaderboard method", error);
        res.status(500).json({ message: "Internal server error, couldnt find leaderboard (blame dev)" });
    }
}

export async function getNewBestScore(req, res) {
    try {
        const topScore = await Note.findOne().sort({ score: -1 }).select("name score");

        if (!topScore) {
            res.status(404).json({ message: "Error 404 there isnt any score for Leaderboard" });
        } else {
            res.status(200).json(topScore);
        }
    } catch (error) {
        console.error("Error in getNewBestScore method", error);
        res.status(500).json({ message: "Internal server error, couldnt find leaderboard (blame dev)...(also play the game better)" });
    }
}


export async function GetplayersBestScore(req, res) {
    const { id, score } = req.body;
    try {
        const currPlayer = await Note.findById(id);
        if (!currPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }

        // coins = pola skora (npr. score 10 -> 5 coins)
        const earnedCoins = Math.floor(score / 2);
        currPlayer.coins += earnedCoins;

        // best score se menja samo ako je novi veći
        let isNewBest = false;
        if (score > currPlayer.score) {
            currPlayer.score = score;
            isNewBest = true;
        }

        await currPlayer.save();

        return res.status(200).json({
            message: isNewBest ? "New best score!" : "Game over, score not beaten.",
            score: currPlayer.score,
            earnedCoins,
            coins: currPlayer.coins,
            isNewBest,
        });
    } catch (error) {
        console.error("Error in GetplayersBestScore", error);
        res.status(400).json({ message: "Error saving score" });
    }
}
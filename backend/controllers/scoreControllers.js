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

        if (score > currPlayer.score) {
            currPlayer.score = score;
            await currPlayer.save();
            return res.status(200).json({ message: "New best personal score is: ", score: currPlayer.score });
        } else {
            res.status(200).json({ message: "Game over, you havent beaten your score YET (dont blame dev)" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error, we could load your best an d this score " });
    }
}
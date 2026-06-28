import Note from "../models/Note.js";

const SKIN_PRICES = {
    "startrack": 150,
    "kal'ed": 250,
    "noutolan": 700,
    "nairan": 900,
};

export async function getPlayerSkins(req, res) {
    try {
        const player = await Note.findById(req.params.id).select("name skins currentSkin");
        if (!player) {
            return res.status(404).json({ message: "Player not found (blame dev for that)" });
        }
        res.status(200).json(player);
    } catch (error) {
        console.error("Error in getPlayerSkins method", error);
        res.status(500).json({ message: "Internal server error, couldnt load skins (blame dev for that)" });
    }
}

export async function setActiveSkin(req, res) {
    try {
        const { skin } = req.body;
        const player = await Note.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: "Player not found (blame dev for that)" });
        }

        if (!player.skins.includes(skin)) {
            return res.status(400).json({ message: "You dont own this skin" });
        }
        player.currentSkin = skin;
        await player.save();

        res.status(200).json({
            message: "Active skin updated successfully",
            currentSkin: player.currentSkin,
        });
    } catch (error) {
        console.error("Error in setActiveSkin method", error);
        res.status(500).json({ message: "Internal server error, couldnt set active skin (blame dev for that)" });
    }
}

export async function unlockSkin(req, res) {
    try {
        const { skin } = req.body;
        const player = await Note.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: "Player not found (blame dev for that)" });
        }
        if (player.skins.includes(skin)) {
            return res.status(400).json({ message: "You already own this skin" });
        }

        player.skins.push(skin);
        await player.save();

        res.status(200).json({
            message: `Skin '${skin}' unlocked successfully`,
            skins: player.skins,
        });
    } catch (error) {
        console.error("Error in unlockSkin method", error);
        res.status(500).json({ message: "Internal server error, couldnt unlock skin (blame dev for that)" });
    }
}

export async function buySkin(req, res) {
    try {
        const { skin } = req.body;
        const player = await Note.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }

        // da li skin postoji u listi
        if (!SKIN_PRICES[skin]) {
            return res.status(400).json({ message: "This skin does not exist" });
        }

        // da li vec ima skin
        if (player.skins.includes(skin)) {
            return res.status(400).json({ message: "You already own this skin" });
        }

        // da li ima dovoljno coins
        if (player.coins < SKIN_PRICES[skin]) {
            return res.status(400).json({
                message: "You don't have enough coins",
                required: SKIN_PRICES[skin],
                have: player.coins,
            });
        }

        // kupi skin
        player.coins -= SKIN_PRICES[skin];
        player.skins.push(skin);
        await player.save();

        res.status(200).json({
            message: `Skin '${skin}' kupljen uspesno!`,
            coins: player.coins,
            skins: player.skins,
        });
    } catch (error) {
        console.error("Error in buySkin", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
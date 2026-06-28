import Note from "../models/Note.js";
import bcrypt from "bcryptjs";

export async function getAllNotes(_, res) {
    //moze se skipovati za request ako se doda _ umesto njega
    try {
        const notes = await Note.find().sort({ createdAt: -1 }); //najnoviji prvo
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes method", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getElementById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Element not found" });
        } else {
            res.json(note);
        }
    } catch (error) {
        console.error("Error in getElementById controller", error);
        res.status(500).json({ message: "Internal server error (blame dev for that)" });
    }
}

export async function updateAcc(req, res) {
    try {
        const { name, password } = req.body;

        // sklapamo samo polja koja su poslata
        const updateFields = {};
        if (name) updateFields.name = name;

        // ako je poslata nova lozinka -> hesujemo je pre snimanja
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedAcc = await Note.findByIdAndUpdate(req.params.id, updateFields, {
            new: true,
        });

        if (!updatedAcc) {
            return res.status(404).json({ message: "Not found, blame dev for that!" });
        }
        res.status(200).json(updatedAcc);
    } catch (error) {
        console.error("Error in updateNode cotroler", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteAAcc(req, res) {
    try {
        const deletedAcc = await Note.findByIdAndDelete(req.params.id);
        if (!deletedAcc) {
            return res.status(404).json({ message: "Account not found (blame dev for that)" });
        } else {
            res.status(200).json({ message: "Account deleted succesfully!" });
        }
    } catch (error) {
        console.error("Error in deleteNode cotroler", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function addCoins(req, res) {
    try {
        const { coins } = req.body;
        const player = await Note.findById(req.params.id);
        if (!player) return res.status(404).json({ message: "Player not found" });
        player.coins += coins;
        await player.save();
        res.status(200).json({ message: "Coins added!", coins: player.coins });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
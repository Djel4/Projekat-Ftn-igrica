import Note from "../models/Note.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerPlayer(req, res) {
    try {
        const { name, password } = req.body;

        //validacija
        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required." });
        }
        if (name.length < 3) {
            return res.status(400).json({ message: "Name must have at least 3 characters." });
        }
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must have at least 8 characters, one letter and one number.",
            });
        }
        // provera da ime vec ne postoji
        const existing = await Note.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "That name is already taken." });
        }

        //dodato hashovanje
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAcc = new Note({ name, password: hashedPassword });
        const savedAcc = await newAcc.save();
        res.status(201).json({ message: "Account created successfully!", data: savedAcc });
    } catch (error) {
        console.error("Error in registerPlayer", error);
        res.status(400).json({ message: "Bad request action" });
    }
}

export async function loginPlayer(req, res) {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required, try again (dont blame dev)" });
        }
        const player = await Note.findOne({ name });
        if (!player) {
            return res.status(404).json({ message: "Couldnt find player" });
        }
        const matching = await bcrypt.compare(password, player.password);
        if (!matching) {
            return res.status(404).json({ message: "Name or password are wrong try again" });
        }

        // token sada sadrzi i role
        const token = jwt.sign(
            { id: player._id, name: player.name, role: player.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Congrats your login is correct have fun playing (dont blame dev for bugs)",
            id: player._id,
            currentSkin: player.currentSkin,
            role: player.role,
        });
    } catch (error) {
        console.error("Error in loginPlayer method", error);
        res.status(500).json({ message: "Internal server error (blame dev)" });
    }
}


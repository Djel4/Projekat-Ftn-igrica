import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { registerPlayer, loginPlayer } from "../controllers/authControllers.js";
import { getAllNotes, getElementById, updateAcc, deleteAAcc, addCoins } from "../controllers/playerControllers.js";
import { getLeaderBoard, getNewBestScore, GetplayersBestScore } from "../controllers/scoreControllers.js";
import { getPlayerSkins, setActiveSkin, unlockSkin, buySkin,unequipSkin } from "../controllers/skinController.js";

const router = express.Router();

//za admina
router.get("/", protect, admin, getAllNotes);        // lista svih korisnika — samo admin
router.delete("/:id", protect, admin, deleteAAcc);   // brisanje bilo kog naloga — samo admin


//login i register rute
router.post("/register",registerPlayer);

router.post("/login",loginPlayer);

//leaderboard i score
router.get("/leaderboard",getLeaderBoard);

router.get("/global-best",getNewBestScore);

router.put("/save-score", GetplayersBestScore);

router.get("/new-best", getNewBestScore);

//za skinove 
router.get("/:id/skins", getPlayerSkins);
router.put("/:id/skins/active", setActiveSkin);
router.put("/:id/skins/buy", buySkin);
router.put("/:id/skins/unequip", unequipSkin);
//crud rrute 
router.get("/", getAllNotes);

router.get("/:id", getElementById);

router.put("/:id", updateAcc);

router.delete("/:id", deleteAAcc);


export default router;
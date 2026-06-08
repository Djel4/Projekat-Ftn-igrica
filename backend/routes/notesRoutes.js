

import express from "express"
import { getElementById, getAllNotes, updateAcc, deleteAAcc, getNewBestScore, registerPlayer, loginPlayer, getPlayerSkins, setActiveSkin, unlockSkin, GetplayersBestScore, getLeaderBoard} from "../controllers/notesController.js";


const router = express.Router();

//login i register rute
router.post("/register",registerPlayer);

router.post("/login",loginPlayer);

//leaderboard i score
router.get("/leaderboard",getLeaderBoard);

router.get("/global-best",getNewBestScore);

router.put("/save-score", GetplayersBestScore);

router.get("/new-best", getNewBestScore);

router.get("/skins/:id", getPlayerSkins);
router.put("/skins/:id", setActiveSkin);
router.put("/unlock-skin/:id", unlockSkin);

//crud rrute 
router.get("/", getAllNotes);

router.get("/:id", getElementById);

router.put("/:id", updateAcc);

router.delete("/:id", deleteAAcc);


export default router;
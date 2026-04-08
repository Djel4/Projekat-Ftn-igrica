

import express from "express"
import { getElementById, getAllNotes, updateAcc, deleteAAcc, getNewBestScore, registerPlayer, loginPlayer,GetplayersBestScore, getLeaderBoard} from "../controllers/notesController.js";


const router = express.Router();

//login i register rute
router.post("/",registerPlayer);

router.get("/",loginPlayer);

//leaderboard i score
router.get("/:id",getLeaderBoard);

router.get("/:id",getNewBestScore);

router.put("/save-score", GetplayersBestScore);

router.get("/new-best", getNewBestScore);
//crud rrute 
router.get("/", getAllNotes);

router.get("/:id", getElementById);

router.put("/:id", updateAcc);

router.delete("/:id", deleteAAcc);


export default router;
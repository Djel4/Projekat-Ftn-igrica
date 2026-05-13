import Note from "../models/Note.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function registerPlayer (req, res) {
    try {
        const {name,password} = req.body
        //dodato hashovanje 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newAcc = new Note({name, password: hashedPassword });
        const savedAcc = await newAcc.save();
      res.status(201).json({ message: "Account created successfully!", data: savedAcc });
    
    } catch (error) {
        console.error("Error in createANode cotroler", error)
        res.status(400).json({message: "Bad request action" });
        
    }    
}

export async function loginPlayer(req,res)
{
    try {
        const {name, password} =  req.body;
        if (!name || !password) {
            return res.status(400).json({message: "Name and password are required, try again (dont blame dev)"});
        }
        const player = await Note.findOne({name});
        if(!player){
            return res.status(404).json({message: "Couldnt find player"});
        }
        const matching = await bcrypt.compare(password, player.password);
        if (!matching)
        {
            return res.status(404).json({message: "Name or password are wrong try again"});
        }
        else{
            return res.status(200).json({message: "Congrats your login is correct have fun playing (dont blame dev for bugs)"});
        }

    } catch (error) {
        console.error("Error in getLeaderboard method", error);
         res.status(500).json({ message: "Internal server error, couldnt find leaderboard (blame dev)" });
    }
}

export async function getLeaderBoard(_,res){
    try {
        const topPlayer = await Note.find().sort({score: -1}).limit(10).select("name score");
        res.status(200).json(topPlayer);

    } catch (error) {
        console.error("Error in getLeaderboard method", error);
         res.status(500).json({ message: "Internal server error, couldnt find leaderboard (blame dev)" });
    }
}

export async function getNewBestScore(req,res){
  
    try {
       const topScore = await Note.findOne().sort({score:-1}).select("name score");
   
    if(!topScore)
    {
        res.status(404).json({message: "Error 404 there isnt any score for Leaderboard"});
    }
    else
    {
        res.status(200).json(topScore);
    }
  
    } catch (error) {   
          console.error("Error in getNewBestScore method", error);
         res.status(500).json({ message: "Internal server error, couldnt find leaderboard (blame dev)...(also play the game better)" });
    }
    
}

export async function GetplayersBestScore(req,res){
    const {id, score} = req.body;
    try {
        const currPlayer = await Note.findById(id);

        if (score > currPlayer.score)
        {
            currPlayer.score = score;
            await currPlayer.save();
            return res.status(200).json({ message: "New best personal score is: ", score: currPlayer.score })
        }
        else {
            res.status(200).json({message: "Game over, you havent beaten your score YET (dont blame dev)"});
        }
    } catch (error) {
        res.status(400).json({message: "Error, we could load your best an d this score "});
    }
}




export async function getAllNotes(_, res) {//moze se skipovati za request ako se doda _ umesto njega
    try {
    const notes = await Note.find().sort({createdAt:-1}); //trazice notes koje postoje/ pokazuje najnovije prvo (ovo ovde se bazira na karaktere) 
    
    res.status(200).json(notes);
   } catch (error) {
        console.error("Error in getAllNotes method", error);
    res.status(500).json({ message: "Internal server error" });
   }
}
export async function getElementById(req,res) {
    try {
        const note = await Note.findById(req.params.id)
        if(!note){
            return res.status(404).json({message: "Element not found"})
        }
        else{
            res.json(note);
        }
    } catch (error) {
    console.error("Error in getElementById controller", error);
    res.status(500).json({ message: "Internal server error (blame dev for that)" });
    }
}


export async function updateAcc (req, res) { 
    try {
        const {name, password} = req.body
        const updatedAcc = await Note.findByIdAndUpdate(req.params.id,{name,password},{
            new:true,
        })
            if(!updatedAcc)
            {
                return res.status(404).json({message: "Not found, blame dev for that!"})

            }
        res.status(200).json(updatedAcc)
    } catch (error) {
        console.error("Error in updateNode cotroler", error)
        res.status(500).json({message: "Internal server error" });
    }
}
export async function deleteAAcc (req, res) { 
    try {
        const deletedAcc = await Note.findByIdAndDelete(req.params.id)
        if(!deletedAcc)
        {
            return res.status(404).json({message: "Account not found (blame dev for that)"});
        }
        else{
            res.status(200).json({message: "Account deleted succesfully!"});
        }

    } catch (error) {
           console.error("Error in deleteNode cotroler", error)
        res.status(500).json({message: "Internal server error" });
    }

    
}
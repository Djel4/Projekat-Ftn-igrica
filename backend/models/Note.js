import mongoose from "mongoose";

//napraviti semu
//onda model na osnovu seme
                                    //u semu se dodaju objekti 
const noteSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true

    },
    password: {
            type: String,
            required: true
    },
    score: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    skins: {
        type: [String],
        default: ["defaultSkin"]
    },

    currentSkin: {
        type: String,
        default: "defaultSkin"
    },
    coins: { //koristim kao valutu u igri 
    type: Number,
    default: 0
    },

    roles: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
},


    
},
 {timestamps: true} //za createdAT, updatedAt SAMO AKO JE TRUE DODATO
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
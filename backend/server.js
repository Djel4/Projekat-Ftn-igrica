
import dotenv from "dotenv" //ovo treba da bi moglo da se koristi env
dotenv.config();

import express from "express"
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";

const app = express();


app.use(cors()); // dodato po savetu sa interneta

app.use(express.json()); //funkcija izmedju requesta i responsa



app.use("/api/notes", notesRoutes);
const PORT = process.env.PORT || 5001
app.listen(PORT, async () => {
    await connectDB();
console.log("Server started on PORT:", PORT)
})


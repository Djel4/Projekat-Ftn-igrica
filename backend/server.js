
import dotenv from "dotenv" //ovo treba da bi moglo da se koristi env
dotenv.config();

import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";


const app = express();

app.use(cookieParser());//dodat cookie parser

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
}));
 //adresa na kojoj je frontend, moze biti i adresa na kojoj ce biti hostovan frontend
 //dozvoljava slanje cookia
 // dodato po savetu sa interneta

app.use(express.json()); //funkcija izmedju requesta i responsa



app.use("/api/notes", notesRoutes);
const PORT = process.env.PORT || 5001
app.get("/", (req, res) => {
    res.send("Server is running! Try /api/notes to see data.");
});
app.listen(PORT, async () => {
    await connectDB();
console.log("Server started on PORT:", PORT)
})

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server started on port ${PORT}`);
});

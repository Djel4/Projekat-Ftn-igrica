import mongoose from "mongoose"

export const connectDB = async () => {
    try {       //konektovanje baze 
await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb is connected succesfully")
    } catch (error) {
        console.error("Error connecting to MongoDb",error);
        process.exit(1);//ovo znaci da izadje sa failom 0 je success
    }

}
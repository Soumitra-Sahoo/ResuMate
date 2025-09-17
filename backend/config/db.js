import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://soumitrasahoo030_db_user:resume123@cluster0.yn2g7zc.mongodb.net/RESUME')
    .then(() => console.log("DataBase connected"))
}
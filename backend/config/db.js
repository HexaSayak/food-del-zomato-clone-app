import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://sayakstudy24:sayakstudy24@cluster0.8vkxgqr.mongodb.net/food_delivery_app_clone-front-back').then(()=>console.log("DB Connected!"));
}
import orderModel from "../models/orderModel.js";

import userModel from "../models/userModel.js";

import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe('sk_test_51RA54zR78k8qUHrq5nRjiNZsf9xhuEHgs7mCJitelgmeMAa79YkFdMncEPIhfKg0LKZTpLMYIrQtQ7nGu0A6elCo004zsTnPL5');


//place in user order from content

const placeOrder = async (req, res) => {

    // const frontend_url = "https://food-del-app-cmlt-frontend.vercel.app";
    const frontend_url = process.env.FRONTEND_URL || "https://food-del-app-cmlt-frontend.vercel.app";
    if (!frontend_url) {
        return res.status(500).json({ success: false, message: "FRONTEND_URL environment variable is not set." });
    }

    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        console.log(newOrder);
        console.log(req.body);
        
        debugger
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
        const line_items =  req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*80
            },
            quantity:item.quantity
        }))
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })
        res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }    
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//API for updating order status 
const updateStatus = async (req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder, verifyOrder, userOrders,updateStatus, listOrders}
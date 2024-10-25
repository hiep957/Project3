import mongoose from "mongoose";



export interface ICart {
    _id: string;
    userId: mongoose.Schema.Types.ObjectId;
    items: [{
        productId: mongoose.Schema.Types.ObjectId;
        price: number;
        quantity: number;   
    }],
    

}
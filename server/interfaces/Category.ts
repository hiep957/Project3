import { Document, ObjectId } from "mongoose";


export interface ISubCategory {
    _id?: ObjectId;
    name: string;
    types: string[]
}

export interface ICategory extends Document{
    name: string;
    subcategories: ISubCategory[];  
    createdAt: Date;    
    updatedAt: Date;    
}


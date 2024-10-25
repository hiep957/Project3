import express, { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  AuthenticatedRequestBody,
  ICartRequest,
} from "../interfaces/CustomType";
import { ICartUser, IUser } from "../interfaces/User";
import CartModel from "../models/Cart.model";
import { ICart } from "../interfaces/Cart";
import mongoose, { Types } from "mongoose";

export const createCartService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    console.log(req.body);
    console.log(req.user?._id);
    const userId = req.user?._id;
    let cart = await CartModel.findOne({ userId });
    if (cart) throw new Error("Cart already exists");

    const newCart = new CartModel({
      userId,
    });

    const cartSaved = await newCart.save();
    res
      .status(200)
      .json({ message: "Cart created successfully", cart: cartSaved });
  }
);

export const addToCartService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICartUser>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId, quantity, price } = req.body;
    console.log("body", req.body);

    // console.log(productId, quantity, price, req.params.cartId);
    let cart = await CartModel.findOne({ _id: req.params.cartId })
    console.log("Cart", cart);  
    if (!cart) throw new Error("Cart not found");


    //Chuyển productId từ string sang ObjectId
    // kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );

    console.log("Item index", itemIndex);   

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price += price;    
    } else {
      cart.items.push({ productId, quantity, price });
    }

    const cartSave = await cart.save();

    res.status(200).json({ message: "Add to cart successfully", cartPayload: cartSave });
  }
);


export const reduceItemInCartService = asyncHandler(async (req: AuthenticatedRequestBody<ICartUser>, res: Response, next: NextFunction) => {
    
})
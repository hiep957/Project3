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
import ProductModel from "../models/Product.model";
import OrderModel from "../models/Order.model";
import { BadRequestError } from "../utils/ApiError";

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
      .json({ message: "Cart created successfully", cartL: cartSaved });
  }
);

export const addToCartService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICartUser>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId, quantity, price, size } = req.body;
    console.log("body", req.body);
    const userId = req.user?._id;

    // console.log(productId, quantity, price, req.params.cartId);
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await CartModel.findOne({ userId })
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .exec();
    console.log("Cart", cart);
    if (!cart) throw new Error("Cart not found");

    //Chuyển productId từ string sang ObjectId
    // kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    //boi vi populate items.productId nen productId la 1 object
    const itemIndex = cart.items.findIndex((item) => {
      // Lấy ID của sản phẩm
      const productIdToCompare =
        typeof item.productId === "string"
          ? item.productId
          : (item.productId as any)._id;

      return (
        productIdToCompare.toString() === productId.toString() &&
        item.size === size
      );
    });

    console.log("Item index", itemIndex);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price += price;
    } else {
      cart.items.push({ productId, quantity, price, size });
    }

    await cart.save();
    const cartSave = await CartModel.findById(cart._id)
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .exec();

    res
      .status(200)
      .json({ message: "Add to cart successfully", cart:cartSave });
  }
);
export const decreaseItemCartService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICartUser>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?._id;
    const { productId, quantity, price, size } = req.body;
    if(!productId || !quantity || !price || !size){
      throw new BadRequestError("Missing required fields");
    }
    const cart = await CartModel.findOne({ userId })
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .exec();
      //6745e57c3a366c83f40686fb
    if (!cart) throw new BadRequestError("Cart not found");

    const itemIndex = cart.items.findIndex((item) => {
      // Lấy ID của sản phẩm
      const productIdToCompare =
        typeof item.productId === "string"
          ? item.productId
          : (item.productId as any)._id;

      return (
        productIdToCompare.toString() === productId.toString() &&
        item.size === size
      );
    });

    if (itemIndex > -1) {
      // Kiểm tra số lượng trước khi giảm
      if (cart.items[itemIndex].quantity < quantity) {
        return res.status(400).json({
          message: "Quantity to decrease is greater than current quantity",
        });
      }

      cart.items[itemIndex].quantity -= quantity;
      cart.items[itemIndex].price -= price;

      // Xóa mục nếu số lượng bằng 0
      if (cart.items[itemIndex].quantity === 0) {
        cart.items.splice(itemIndex, 1);
      }
    } else {
      // Không tìm thấy sản phẩm trong giỏ hàng
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    await cart.save();

    const cartSave = await CartModel.findById(cart._id)
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .exec();

    res.status(200).json({
      message: "Decrease item cart successfully",
      cart: cartSave,
    });
  }
);

export const getCartService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?._id;
    const cart = await CartModel.findOne({ userId })
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .exec();
    console.log("Cart", cart);
    if (!cart) throw new Error("Cart not found");
    res.status(200).json({
      message: "Get cart successfully",
      cart: cart,
    });
  }
);

export const removeCartItemAfterPaymentService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICartUser>,
    res: Response,
    next: NextFunction
  ) => {
    const { orderCode } = req.params;
    console.log("Order code", orderCode);

    const order = await OrderModel.findOne({ orderCode });
    if (!order) throw new Error("Order not found");
    console.log("Order", order);
    const cart = await CartModel.findOne({ userId: req.user?._id });
    if (!cart) throw new Error("Cart not found");

    const orderProductIds = order.items.map((item) =>
      item.productId.toString()
    );
    const updatedCartItems = cart.items.filter(
      (cartItem) =>
        !orderProductIds.includes(cartItem.productId.toString()) ||
        !order.items.some(
          (orderItem) =>
            orderItem.productId.toString() === cartItem.productId.toString() &&
            orderItem.size === cartItem.size
        )
    );

    // Cập nhật giỏ hàng
    cart.items = updatedCartItems;
    await cart.save();

    console.log("Cart before", cart);

    res
      .status(200)
      .json({ message: "Remove cart item after payment successfully" });
  }
);

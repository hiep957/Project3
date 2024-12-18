import { stat } from "fs";
import asyncHandler from "../utils/asyncHandler";
import OrderModel from "../models/Order.model";
import PayOS from "@payos/node";
import express, { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/ApiError";
import { IOrder, IOrderRequest } from "../interfaces/Order";
import { AuthenticatedRequestBody } from "../interfaces/CustomType";
import { payosClient } from "..";
import { IPaymentRequest, IUser } from "../interfaces/User";
import UserModel from "../models/User.model";
import nodemailer from "nodemailer";
import { getOrderStatusEmailHtml } from "../utils/SendEmail";
import dotenv from "dotenv";
dotenv.config();
const App_password = process.env.APP_PASSWORD?.toString();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "hiepma80@gmail.com",
    pass: App_password,
  },
});

function generateRandomSixDigits(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export const createOrderService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IOrderRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      items,
      totalAmount,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
    } = req.body;
    console.log("items", items);
    console.log("body", req.body);
    console.log("totalAmount", totalAmount);
    const newOrder = {
      userId: req.user?._id,
      orderCode: generateRandomSixDigits(),
      items,
      totalAmount,
      status: "pending",
      buyerAddress: buyerAddress,
      buyerName: buyerName,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
    };
    const savedOrder = await OrderModel.create(newOrder);

    console.log("savedOrder", savedOrder);

    if (!savedOrder) {
      throw new BadRequestError("Error while creating order");
    }

    const paymentData = {
      orderCode: savedOrder.orderCode,
      amount: savedOrder.totalAmount,
      description: "Thanh toán đơn hàng",
      cancelUrl: "https://www.youtube.com/watch?v=nGryTTX0VaM",
      returnUrl: `http://localhost:3000/success/${savedOrder.orderCode}`,
      items: items || [],
      buyerName: buyerName,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
      buyerAddress: buyerAddress,
    };
    console.log("paymentData", paymentData);

    const paymentResult = await payosClient.createPaymentLink(paymentData);
    console.log("paymentResult", paymentResult);

    if (!paymentResult) {
      throw new BadRequestError("Error while creating payment link");
    }

    res.status(200).json({
      status: "success",
      data: paymentResult,
    });
  }
);

export const getPaymentInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderCode = req.params.orderCode;
    const paymentInfo = await payosClient.getPaymentLinkInformation(orderCode);
    console.log("paymentInfo", paymentInfo);
    if (!paymentInfo) {
      throw new BadRequestError("Error while getting payment information");
    }

    let paymentStatus = "pending";

    switch (paymentInfo.status) {
      case "PAID":
        paymentStatus = "paid";
        break;
      case "CANCELED":
        paymentStatus = "canceled";
        break;
      case "EXPIRED":
        paymentStatus = "expired";
        break;
    }

    const updateOrder = await OrderModel.findOneAndUpdate(
      { orderCode },
      { status: paymentStatus, paymentStatus: paymentInfo.status },
      { new: true }
    );

    await transporter.sendMail({
      from: "hiepma80@gmail.com",
      to: updateOrder?.buyerEmail,
      subject: "Order status",
      text: `Your order with code ${updateOrder?.orderCode} has been ${paymentStatus}`,
      html: getOrderStatusEmailHtml(updateOrder, paymentStatus),
    });

    console.log("updateOrder", updateOrder);

    res.status(200).json({
      status: "success",
      data: { paymentInfo, message: "Đã gửi email thành công" },
    });
  }
);

export const getUserOrderService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IPaymentRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { limit, page } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const userId = req.user?._id;
    const orders = await OrderModel.find({ userId })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    if (!orders) {
      throw new BadRequestError("Error while getting user orders");
    }
    const total = await OrderModel.countDocuments({ userId });
    res.status(200).json({
      status: "success",
      data: {
        orders,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  }
);

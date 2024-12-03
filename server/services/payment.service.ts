import { stat } from "fs";
import asyncHandler from "../utils/asyncHandler";
import OrderModel from "../models/Order.model";
import PayOS from "@payos/node";
import express, { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/ApiError";
import { IOrder, IOrderRequest } from "../interfaces/Order";
import { AuthenticatedRequestBody } from "../interfaces/CustomType";
import { payosClient } from "..";

function generateRandomSixDigits(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export const createOrderService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IOrderRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { items, totalAmount } = req.body;
    console.log("items", items);
    const newOrder = {
      userId: req.user?._id,
      orderCode: generateRandomSixDigits(),
      items,
      totalAmount,
      status: "pending",
    };
    const savedOrder = await OrderModel.create(newOrder);

    console.log("savedOrder", savedOrder);

    if (!savedOrder) {
      throw new BadRequestError("Error while creating order");
    }

    const paymentData = {
      orderCode: savedOrder.orderCode,
      amount: totalAmount,
      description: "Thanh toán đơn hàng",
      cancelUrl: "https://www.youtube.com/watch?v=nGryTTX0VaM",
      returnUrl: "https://www.youtube.com/",
      items: items || [],
    };

    const paymentResult = await payosClient.createPaymentLink(paymentData);

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

    console.log("updateOrder", updateOrder);  

    res.status(200).json({
      status: "success",
      data: paymentInfo,
    });
  }
);

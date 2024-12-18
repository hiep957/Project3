import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interfaces/Order";

const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderCode: {
        type: Number,
        required: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
          
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "",
    },
    buyerAddress: {
      type: String,
      default: "",
    },
    buyerName: {
      type: String,
      default: "",
    },
    buyerEmail: {
      type: String,
      default: "",
    },
    buyerPhone: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);

import { mongo, Schema } from "mongoose";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface IOrder {
  orderCode: number;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status?:
    | "pending"
    | "paid"
    | "canceled"
    | "shipped"
    | "delivered"
    | "expired"; // Trạng thái đơn hàng
  buyerAddress?: string;
  buyerName?: string; // Tên người mua
  buyerEmail?: string; // Email người mua
  buyerPhone?: string; // Số điện thoại người mua
  paymentMethod?: "COD" | "online"; // Phương thức thanh toán
  paymentStatus?: "pending" | "completed" | "failed"; // Trạng thái thanh toán
}

export interface IOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
}

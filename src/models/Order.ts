import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  foodItem: mongoose.Types.ObjectId;
  name: string;
  size?: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: IOrderItem[];
  total: number;
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerAddress: { type: String, required: true },
    items: [
      {
        foodItem: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
        name: { type: String, required: true },
        size: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "preparing", "ready", "delivered", "cancelled"],
      default: "placed",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

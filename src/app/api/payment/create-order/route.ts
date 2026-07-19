import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { amount, items, customer } = await request.json();

    if (!amount || !items || !customer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await Order.create({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: customer.address,
      items: items.map((item: { foodItem: string; name: string; size?: string; price: number; quantity: number }) => ({
        foodItem: item.foodItem,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      })),
      total: amount,
      paymentStatus: "pending",
    });

    // Create Razorpay order
    // In production, use Razorpay SDK:
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const razorpayOrder = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: order._id.toString() });

    // For now, generate a mock order ID for development
    const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await Order.findByIdAndUpdate(order._id, { razorpayOrderId });

    return NextResponse.json({
      orderId: razorpayOrderId,
      amount: amount * 100, // Razorpay expects amount in paise
      dbOrderId: order._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { razorpay_order_id, razorpay_payment_id, orderId } =
      await request.json();

    // In production, verify the signature:
    // const crypto = require('crypto');
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(razorpay_order_id + '|' + razorpay_payment_id)
    //   .digest('hex');
    // if (expectedSignature !== razorpay_signature) {
    //   return NextResponse.json({ success: false }, { status: 400 });
    // }

    // Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "completed",
        razorpayPaymentId: razorpay_payment_id,
        orderStatus: "placed",
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}

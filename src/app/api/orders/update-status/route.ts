import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

function getAuth(request: Request) {
  const token = request.headers.get("cookie")?.match(/admin-token=([^;]+)/)?.[1];
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { orderId, orderStatus } = await request.json();

    if (!orderId || !orderStatus) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

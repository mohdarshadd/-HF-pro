import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone || phone.trim().length < 5) {
    return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const orders = await Order.find({
      customerPhone: { $regex: phone.trim(), $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error tracking orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

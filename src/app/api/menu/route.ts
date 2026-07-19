import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import FoodItem from "@/models/FoodItem";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = {};
    if (category) {
      filter.category = category;
    }

    const items = await FoodItem.find(filter).sort({ displayOrder: 1 }).lean();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

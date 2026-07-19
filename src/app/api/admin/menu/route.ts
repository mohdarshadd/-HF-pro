import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import FoodItem from "@/models/FoodItem";
import { verifyToken } from "@/lib/auth";

function getAuth(request: Request) {
  const token = request.headers.get("cookie")?.match(/admin-token=([^;]+)/)?.[1];
  if (!token) return null;
  return verifyToken(token);
}

export async function GET() {
  try {
    await connectToDatabase();
    const items = await FoodItem.find({}).sort({ category: 1, displayOrder: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    const item = await FoodItem.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const item = await FoodItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await FoodItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

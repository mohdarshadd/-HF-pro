import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFoodItem extends Document {
  name: string;
  category: string;
  subCategory?: string;
  description: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  hasSizes: boolean;
  sizes: { label: string; price: number }[];
  price: number;
  displayOrder: number;
}

const FoodItemSchema = new Schema<IFoodItem>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "/images/placeholder-food.jpg" },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    hasSizes: { type: Boolean, default: false },
    sizes: [
      {
        label: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    price: { type: Number, default: 0 },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FoodItem: Model<IFoodItem> =
  mongoose.models.FoodItem || mongoose.model<IFoodItem>("FoodItem", FoodItemSchema);

export default FoodItem;

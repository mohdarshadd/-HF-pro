import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import FoodItem from "../models/FoodItem";
import Admin from "../models/Admin";

const MONGODB_URI = process.env.MONGODB_URI!;

const categories = [
  { name: "Classic", slug: "classic", displayOrder: 1 },
  { name: "Simple Veg", slug: "simple-veg", displayOrder: 2 },
  { name: "Veg Favorite", slug: "veg-favorite", displayOrder: 3 },
  { name: "Supreme", slug: "supreme", displayOrder: 4 },
  { name: "Ultimate", slug: "ultimate", displayOrder: 5 },
  { name: "Pizza Mania - Single Topping", slug: "mania-single", displayOrder: 6 },
  { name: "Pizza Mania - Double Topping", slug: "mania-double", displayOrder: 7 },
  { name: "Yummy Pizza", slug: "yummy-pizza", displayOrder: 8 },
  { name: "Burgers", slug: "burgers", displayOrder: 9 },
  { name: "Sandwich", slug: "sandwich", displayOrder: 10 },
  { name: "Pasta", slug: "pasta", displayOrder: 11 },
  { name: "Garlic Bread", slug: "garlic-bread", displayOrder: 12 },
  { name: "Fries", slug: "fries", displayOrder: 13 },
  { name: "Wraps", slug: "wraps", displayOrder: 14 },
  { name: "Salad", slug: "salad", displayOrder: 15 },
  { name: "Sides", slug: "sides", displayOrder: 16 },
  { name: "Shakes", slug: "shakes", displayOrder: 17 },
  { name: "Coffee", slug: "coffee", displayOrder: 18 },
  { name: "Mocktails", slug: "mocktails", displayOrder: 19 },
  { name: "Drinks", slug: "drinks", displayOrder: 20 },
  { name: "Rolls", slug: "rolls", displayOrder: 21 },
  { name: "Combos", slug: "combos", displayOrder: 22 },
];

type FoodItemInput = {
  name: string;
  category: string;
  subCategory?: string;
  image: string;
  hasSizes: boolean;
  sizes: { label: string; price: number }[];
  price: number;
  displayOrder: number;
};

const categoryImages: Record<string, string> = {
  "Classic": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
  "Simple Veg": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop",
  "Veg Favorite": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
  "Supreme": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
  "Ultimate": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=400&fit=crop",
  "Pizza Mania - Single Topping": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&h=400&fit=crop",
  "Pizza Mania - Double Topping": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&h=400&fit=crop",
  "Yummy Pizza": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop",
  "Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
  "Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
  "Pasta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop",
  "Garlic Bread": "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&h=400&fit=crop",
  "Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop",
  "Wraps": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
  "Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
  "Sides": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
  "Shakes": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop",
  "Coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
  "Mocktails": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&h=400&fit=crop",
  "Drinks": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=400&fit=crop",
  "Rolls": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
  "Combos": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
};

function img(category: string): string {
  return categoryImages[category] || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop";
}

const menuItems: FoodItemInput[] = [
  // Classic
  { name: "Margharita (Single Cheese Pizza)", category: "Classic", image: img("Classic"), hasSizes: true, sizes: [{ label: "Small", price: 100 }, { label: "Medium", price: 200 }, { label: "Large", price: 280 }], price: 0, displayOrder: 1 },

  // Simple Veg
  { name: "Cheese Tomato Pizza", category: "Simple Veg", image: img("Simple Veg"), hasSizes: true, sizes: [{ label: "Small", price: 130 }, { label: "Medium", price: 250 }, { label: "Large", price: 360 }], price: 0, displayOrder: 1 },
  { name: "Cheese Corn", category: "Simple Veg", image: img("Simple Veg"), hasSizes: true, sizes: [{ label: "Small", price: 130 }, { label: "Medium", price: 250 }, { label: "Large", price: 360 }], price: 0, displayOrder: 2 },
  { name: "Cheese Capsicum", category: "Simple Veg", image: img("Simple Veg"), hasSizes: true, sizes: [{ label: "Small", price: 130 }, { label: "Medium", price: 250 }, { label: "Large", price: 360 }], price: 0, displayOrder: 3 },
  { name: "Cheese & Mushroom", category: "Simple Veg", image: img("Simple Veg"), hasSizes: true, sizes: [{ label: "Small", price: 130 }, { label: "Medium", price: 250 }, { label: "Large", price: 360 }], price: 0, displayOrder: 4 },

  // Veg Favorite
  { name: "Green Pizza", category: "Veg Favorite", image: img("Veg Favorite"), hasSizes: true, sizes: [{ label: "Small", price: 160 }, { label: "Medium", price: 300 }, { label: "Large", price: 430 }], price: 0, displayOrder: 1 },
  { name: "Fresh House", category: "Veg Favorite", image: img("Veg Favorite"), hasSizes: true, sizes: [{ label: "Small", price: 160 }, { label: "Medium", price: 300 }, { label: "Large", price: 430 }], price: 0, displayOrder: 2 },
  { name: "Chilly Paneer Pizza", category: "Veg Favorite", image: img("Veg Favorite"), hasSizes: true, sizes: [{ label: "Small", price: 160 }, { label: "Medium", price: 300 }, { label: "Large", price: 430 }], price: 0, displayOrder: 3 },
  { name: "Golden Pizza", category: "Veg Favorite", image: img("Veg Favorite"), hasSizes: true, sizes: [{ label: "Small", price: 160 }, { label: "Medium", price: 300 }, { label: "Large", price: 430 }], price: 0, displayOrder: 4 },

  // Supreme
  { name: "Deluxe Pizza", category: "Supreme", image: img("Supreme"), hasSizes: true, sizes: [{ label: "Small", price: 180 }, { label: "Medium", price: 350 }, { label: "Large", price: 499 }], price: 0, displayOrder: 1 },
  { name: "Mexicana", category: "Supreme", image: img("Supreme"), hasSizes: true, sizes: [{ label: "Small", price: 180 }, { label: "Medium", price: 350 }, { label: "Large", price: 499 }], price: 0, displayOrder: 2 },
  { name: "Gourmet", category: "Supreme", image: img("Supreme"), hasSizes: true, sizes: [{ label: "Small", price: 180 }, { label: "Medium", price: 350 }, { label: "Large", price: 499 }], price: 0, displayOrder: 3 },
  { name: "Spicy Pizza", category: "Supreme", image: img("Supreme"), hasSizes: true, sizes: [{ label: "Small", price: 180 }, { label: "Medium", price: 350 }, { label: "Large", price: 499 }], price: 0, displayOrder: 4 },

  // Ultimate
  { name: "Multi Veg Pizza", category: "Ultimate", image: img("Ultimate"), hasSizes: true, sizes: [{ label: "Small", price: 220 }, { label: "Medium", price: 430 }, { label: "Large", price: 599 }], price: 0, displayOrder: 1 },
  { name: "Spicy Veg Pizza", category: "Ultimate", image: img("Ultimate"), hasSizes: true, sizes: [{ label: "Small", price: 220 }, { label: "Medium", price: 430 }, { label: "Large", price: 599 }], price: 0, displayOrder: 2 },

  // Pizza Mania - Single Topping
  { name: "Soya", category: "Pizza Mania - Single Topping", image: img("Pizza Mania - Single Topping"), hasSizes: false, sizes: [], price: 59, displayOrder: 1 },
  { name: "Onion", category: "Pizza Mania - Single Topping", image: img("Pizza Mania - Single Topping"), hasSizes: false, sizes: [], price: 65, displayOrder: 2 },
  { name: "Capsicum", category: "Pizza Mania - Single Topping", image: img("Pizza Mania - Single Topping"), hasSizes: false, sizes: [], price: 70, displayOrder: 3 },
  { name: "Corn", category: "Pizza Mania - Single Topping", image: img("Pizza Mania - Single Topping"), hasSizes: false, sizes: [], price: 75, displayOrder: 4 },
  { name: "Pineapple", category: "Pizza Mania - Single Topping", image: img("Pizza Mania - Single Topping"), hasSizes: false, sizes: [], price: 75, displayOrder: 5 },

  // Pizza Mania - Double Topping
  { name: "Onion & Jalapeno", category: "Pizza Mania - Double Topping", image: img("Pizza Mania - Double Topping"), hasSizes: false, sizes: [], price: 80, displayOrder: 1 },
  { name: "Onion & Capsicum", category: "Pizza Mania - Double Topping", image: img("Pizza Mania - Double Topping"), hasSizes: false, sizes: [], price: 80, displayOrder: 2 },
  { name: "Soya & Corn", category: "Pizza Mania - Double Topping", image: img("Pizza Mania - Double Topping"), hasSizes: false, sizes: [], price: 80, displayOrder: 3 },
  { name: "Paneer & Onion", category: "Pizza Mania - Double Topping", image: img("Pizza Mania - Double Topping"), hasSizes: false, sizes: [], price: 90, displayOrder: 4 },
  { name: "Jalapeno & Pineapple", category: "Pizza Mania - Double Topping", image: img("Pizza Mania - Double Topping"), hasSizes: false, sizes: [], price: 90, displayOrder: 5 },

  // Yummy Pizza
  { name: "Capsicum, Corn, Jalapeno", category: "Yummy Pizza", image: img("Yummy Pizza"), hasSizes: true, sizes: [{ label: "Small", price: 120 }, { label: "Medium", price: 220 }], price: 0, displayOrder: 1 },
  { name: "Onion, Capsicum, Paneer", category: "Yummy Pizza", image: img("Yummy Pizza"), hasSizes: true, sizes: [{ label: "Small", price: 130 }, { label: "Medium", price: 240 }], price: 0, displayOrder: 2 },

  // Burgers
  { name: "Aloo Tikki Burger", category: "Burgers", image: img("Burgers"), hasSizes: false, sizes: [], price: 39, displayOrder: 1 },
  { name: "Veg Burger", category: "Burgers", image: img("Burgers"), hasSizes: false, sizes: [], price: 50, displayOrder: 2 },
  { name: "Cheesy Burger", category: "Burgers", image: img("Burgers"), hasSizes: false, sizes: [], price: 60, displayOrder: 3 },
  { name: "Delight Burger", category: "Burgers", image: img("Burgers"), hasSizes: false, sizes: [], price: 70, displayOrder: 4 },
  { name: "Cheesy & Spicy Burger", category: "Burgers", image: img("Burgers"), hasSizes: false, sizes: [], price: 70, displayOrder: 5 },
  { name: "Spicy Paneer Burger", category: "Burgers", image: img("Burgers"), hasSizes: false, sizes: [], price: 90, displayOrder: 6 },
  { name: "Hello Special Burger", category: "Burgers", image: img("Burgers"), hasSizes: false, sizes: [], price: 100, displayOrder: 7 },

  // Sandwich
  { name: "Grilled Sandwich (2 pcs.)", category: "Sandwich", image: img("Sandwich"), hasSizes: false, sizes: [], price: 70, displayOrder: 1 },
  { name: "Cheesy Grill Sandwich (2 pcs.)", category: "Sandwich", image: img("Sandwich"), hasSizes: false, sizes: [], price: 80, displayOrder: 2 },
  { name: "Spicy Paneer Sandwich (2 pcs.)", category: "Sandwich", image: img("Sandwich"), hasSizes: false, sizes: [], price: 100, displayOrder: 3 },

  // Pasta
  { name: "Red Pasta", category: "Pasta", image: img("Pasta"), hasSizes: false, sizes: [], price: 90, displayOrder: 1 },
  { name: "White Pasta", category: "Pasta", image: img("Pasta"), hasSizes: false, sizes: [], price: 90, displayOrder: 2 },
  { name: "Jumbo Pasta", category: "Pasta", image: img("Pasta"), hasSizes: false, sizes: [], price: 100, displayOrder: 3 },
  { name: "Makhani Pasta", category: "Pasta", image: img("Pasta"), hasSizes: false, sizes: [], price: 100, displayOrder: 4 },

  // Garlic Bread
  { name: "Garlic Bread", category: "Garlic Bread", image: img("Garlic Bread"), hasSizes: false, sizes: [], price: 100, displayOrder: 1 },
  { name: "Stuffed Garlic Bread", category: "Garlic Bread", image: img("Garlic Bread"), hasSizes: false, sizes: [], price: 120, displayOrder: 2 },

  // Fries
  { name: "French Fries", category: "Fries", image: img("Fries"), hasSizes: false, sizes: [], price: 60, displayOrder: 1 },
  { name: "Peri Peri Fries", category: "Fries", image: img("Fries"), hasSizes: false, sizes: [], price: 70, displayOrder: 2 },
  { name: "Cheesy Fries", category: "Fries", image: img("Fries"), hasSizes: false, sizes: [], price: 80, displayOrder: 3 },

  // Wraps
  { name: "Cheesy & Saucy Wrap", category: "Wraps", image: img("Wraps"), hasSizes: false, sizes: [], price: 90, displayOrder: 1 },
  { name: "Paneer Wrap", category: "Wraps", image: img("Wraps"), hasSizes: false, sizes: [], price: 110, displayOrder: 2 },

  // Salad
  { name: "Veg Delight Salad", category: "Salad", image: img("Salad"), hasSizes: false, sizes: [], price: 120, displayOrder: 1 },
  { name: "Paneer Salad", category: "Salad", image: img("Salad"), hasSizes: false, sizes: [], price: 150, displayOrder: 2 },
  { name: "American Veg", category: "Salad", image: img("Salad"), hasSizes: false, sizes: [], price: 170, displayOrder: 3 },

  // Sides
  { name: "Lava Cake", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 60, displayOrder: 1 },
  { name: "Cheesy Dip", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 20, displayOrder: 2 },
  { name: "Spicy Dip", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 20, displayOrder: 3 },
  { name: "Green Dip", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 20, displayOrder: 4 },
  { name: "Paneer Parcel", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 50, displayOrder: 5 },
  { name: "Calzone", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 90, displayOrder: 6 },
  { name: "Sweet Corn (Cup)", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 50, displayOrder: 7 },
  { name: "Veggie Sub (2 pcs.)", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 100, displayOrder: 8 },
  { name: "Cheese Corn Roll", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 120, displayOrder: 9 },
  { name: "Spicy Corn Roll", category: "Sides", image: img("Sides"), hasSizes: false, sizes: [], price: 130, displayOrder: 10 },

  // Shakes
  { name: "Strawberry Shake", category: "Shakes", image: img("Shakes"), hasSizes: false, sizes: [], price: 90, displayOrder: 1 },
  { name: "Blueberry Shake", category: "Shakes", image: img("Shakes"), hasSizes: false, sizes: [], price: 90, displayOrder: 2 },
  { name: "Chocolate Shake", category: "Shakes", image: img("Shakes"), hasSizes: false, sizes: [], price: 90, displayOrder: 3 },
  { name: "Butter Scotch", category: "Shakes", image: img("Shakes"), hasSizes: false, sizes: [], price: 100, displayOrder: 4 },
  { name: "Black Currant", category: "Shakes", image: img("Shakes"), hasSizes: false, sizes: [], price: 100, displayOrder: 5 },
  { name: "Chocolate Oreo", category: "Shakes", image: img("Shakes"), hasSizes: false, sizes: [], price: 100, displayOrder: 6 },
  { name: "Kit-Kat Shake", category: "Shakes", image: img("Shakes"), hasSizes: false, sizes: [], price: 100, displayOrder: 7 },

  // Coffee
  { name: "Hot Coffee (Cappuccino)", category: "Coffee", image: img("Coffee"), hasSizes: false, sizes: [], price: 50, displayOrder: 1 },
  { name: "Hot Coffee (Mochaccino)", category: "Coffee", image: img("Coffee"), hasSizes: false, sizes: [], price: 60, displayOrder: 2 },
  { name: "Cold Coffee", category: "Coffee", image: img("Coffee"), hasSizes: false, sizes: [], price: 90, displayOrder: 3 },

  // Mocktails
  { name: "Mint Mojito", category: "Mocktails", image: img("Mocktails"), hasSizes: false, sizes: [], price: 70, displayOrder: 1 },
  { name: "Green Apple", category: "Mocktails", image: img("Mocktails"), hasSizes: false, sizes: [], price: 70, displayOrder: 2 },
  { name: "Blue Lagoon", category: "Mocktails", image: img("Mocktails"), hasSizes: false, sizes: [], price: 70, displayOrder: 3 },
  { name: "Watermelon", category: "Mocktails", image: img("Mocktails"), hasSizes: false, sizes: [], price: 70, displayOrder: 4 },

  // Drinks
  { name: "Coke (300 ml Glass)", category: "Drinks", image: img("Drinks"), hasSizes: false, sizes: [], price: 30, displayOrder: 1 },
  { name: "Sprite (300 ml Glass)", category: "Drinks", image: img("Drinks"), hasSizes: false, sizes: [], price: 30, displayOrder: 2 },
  { name: "Mineral Water", category: "Drinks", image: img("Drinks"), hasSizes: false, sizes: [], price: 20, displayOrder: 3 },
  { name: "Fruit Beer", category: "Drinks", image: img("Drinks"), hasSizes: false, sizes: [], price: 80, displayOrder: 4 },

  // Rolls
  { name: "Veg Roll", category: "Rolls", image: img("Rolls"), hasSizes: false, sizes: [], price: 80, displayOrder: 1 },
  { name: "Paneer Roll", category: "Rolls", image: img("Rolls"), hasSizes: false, sizes: [], price: 100, displayOrder: 2 },

  // Combos
  { name: "Jalapeno + Pineapple Pizza + Coke", category: "Combos", image: img("Combos"), hasSizes: false, sizes: [], price: 110, displayOrder: 1 },
  { name: "Paneer Onion Pizza + Coke", category: "Combos", image: img("Combos"), hasSizes: false, sizes: [], price: 110, displayOrder: 2 },
  { name: "Spicy Paneer Burger + Coke", category: "Combos", image: img("Combos"), hasSizes: false, sizes: [], price: 110, displayOrder: 3 },
  { name: "Hello Special Burger + Mocktails", category: "Combos", image: img("Combos"), hasSizes: false, sizes: [], price: 150, displayOrder: 4 },
];

export { categories };

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await FoodItem.deleteMany({});
  await Admin.deleteMany({});
  console.log("Cleared existing data");

  // Seed food items
  const result = await FoodItem.insertMany(menuItems);
  console.log(`Seeded ${result.length} food items`);

  // Seed admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await Admin.create({
    username: "admin",
    password: hashedPassword,
  });
  console.log("Seeded admin user (admin / admin123)");

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});

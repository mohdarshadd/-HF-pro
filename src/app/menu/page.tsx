import { Suspense } from "react";
import MenuClient from "@/components/menu/MenuClient";

export const metadata = {
  title: "Menu | Hello Food Pilibhit",
  description:
    "Browse our full menu — pizzas, burgers, pasta, shakes, fries, and more. Order online from Hello Food, Pilibhit.",
};

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-muted">Loading menu...</div>
        </div>
      }
    >
      <MenuClient />
    </Suspense>
  );
}

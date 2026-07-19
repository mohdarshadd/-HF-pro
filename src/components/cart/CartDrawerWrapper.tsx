"use client";

import { useCart } from "@/hooks/useCart";
import CartDrawer from "./CartDrawer";

export default function CartDrawerWrapper() {
  const isOpen = useCart((s) => s.isCartOpen);
  const closeCart = useCart((s) => s.closeCart);

  return <CartDrawer isOpen={isOpen} onClose={closeCart} />;
}

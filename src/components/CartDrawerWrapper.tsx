'use client'
import { useCart } from "@/app/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function CartDrawerWrapper() {
  const { isCartOpen, setIsCartOpen } = useCart();
  return <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />;
}


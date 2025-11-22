"use client";
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import PhoneOTPModal from "@/components/PhoneOTPModal";
import AddressModal from "@/components/AddressModal";

export type CartItem = {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  weight: number;
  productTitle: string;
  productImage?: string;
};

export type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  showCheckoutOTP: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (productId: number, variantId: number) => Promise<void>;
  updateQuantity: (productId: number, variantId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cart: "ygf_cart",
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { user, jwt, refreshUser } = useAuth();
  const isSyncingRef = useRef<boolean>(false);
  
  // Modal states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<Omit<CartItem, 'quantity'> | null>(null);
  const [userPhone, setUserPhone] = useState<string>("");

  // Load cart from localStorage on mount
  
  const syncCart = useCallback(async () => {
    if (!user || !jwt || isSyncingRef.current) return;

    try {
      isSyncingRef.current = true;
      setIsLoading(true);
      
      // Get current cart from backend
      const response = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (response.ok) {
        const userData = await response.json();
        const backendCart = userData.cart || [];
        
        // Merge with local cart (backend takes precedence for conflicts)
        // Use functional update to avoid stale closure and infinite loop
        setItems(prevItems => {
          const mergedCart = [...prevItems];
          
          backendCart.forEach((backendItem: CartItem) => {
            const existingIndex = mergedCart.findIndex(
              item => item.productId === backendItem.productId && item.variantId === backendItem.variantId
            );
            
            if (existingIndex >= 0) {
              // Update existing item with backend data
              mergedCart[existingIndex] = backendItem;
            } else {
              // Add new item from backend
              mergedCart.push(backendItem);
            }
          });

          return mergedCart;
        });
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setIsLoading(false);
      isSyncingRef.current = false;
    }
  }, [user, jwt]);
  useEffect(() => {
    try {
      const storedCart = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.cart) : null;
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
    }
  }, []);

  // Sync cart with backend when user logs in
  useEffect(() => {
    if (user && jwt) {
      syncCart();
    }
  }, [user, jwt, syncCart]);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    }
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);


  const saveCartToBackend = useCallback(async (cartItems: CartItem[]) => {
    if (!user || !jwt) return;

    try {
      const response = await fetch(`${BACKEND}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          cart: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save cart to backend");
      }
    } catch (error) {
      console.error("Error saving cart to backend:", error);
      throw error;
    }
  }, [user, jwt]);

  const checkUserAddress = useCallback(async (): Promise<boolean> => {
    if (!jwt) return false;
    
    try {
      const response = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      if (response.ok) {
        const userData = await response.json();
        return !!(userData.AddressLine1 && userData.City && userData.State && userData.Pin);
      }
    } catch (error) {
      console.error("Error checking user address:", error);
    }
    return false;
  }, [jwt]);

  const saveAddressToBackend = useCallback(async (address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }) => {
    if (!user || !jwt) return;

    try {
      const payload: Record<string, string | number> = {
        username: address.fullName,
        Phone: address.phone.replace(/\D/g, ''),
        AddressLine1: address.addressLine1,
        AddressLine2: address.addressLine2 || "",
        City: address.city,
        State: address.state,
        Pin: parseInt(address.pincode),
      };

      const response = await fetch(`${BACKEND}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      await refreshUser();
    } catch (error) {
      console.error("Error saving address:", error);
      throw error;
    }
  }, [user, jwt, refreshUser]);

  const addToCartDirectly = useCallback(async (newItem: Omit<CartItem, 'quantity'>) => {
    try {
      setIsLoading(true);
      
      const existingItemIndex = items.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...items, { ...newItem, quantity: 1 }];
      }

      setItems(updatedItems);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend(updatedItems);
      }

      // Open cart drawer after adding item
      setIsCartOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [items, user, jwt, saveCartToBackend]);

  const handleOTPSuccess = useCallback(async (phone: string) => {
    setUserPhone(phone);
    // After OTP login, check if user has address
    const hasAddress = await checkUserAddress();
    
    if (!hasAddress) {
      // Show address modal
      setShowAddressModal(true);
    } else {
      // User has address, if there was a pending cart item, add it
      if (pendingCartItem) {
        await addToCartDirectly(pendingCartItem);
        setPendingCartItem(null);
      } else if (items.length > 0) {
        // If OTP was triggered for checkout (no pending item but cart has items), redirect to checkout
        setIsCartOpen(false);
        // Use setTimeout to ensure state updates are complete
        setTimeout(() => {
          window.location.href = '/checkout';
        }, 100);
      }
    }
  }, [checkUserAddress, pendingCartItem, addToCartDirectly, items.length]);

  const addToCart = useCallback(async (newItem: Omit<CartItem, 'quantity'>) => {
    // Allow adding to cart without login - OTP will be asked at checkout
    await addToCartDirectly(newItem);
  }, [addToCartDirectly]);

  const removeFromCart = useCallback(async (productId: number, variantId: number) => {
    try {
      setIsLoading(true);
      
      const updatedItems = items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );

      setItems(updatedItems);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend(updatedItems);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [items, user, jwt, saveCartToBackend]);

  const updateQuantity = useCallback(async (productId: number, variantId: number, quantity: number) => {
    try {
      setIsLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(productId, variantId);
        return;
      }

      const updatedItems = items.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      );

      setItems(updatedItems);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend(updatedItems);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [items, user, jwt, saveCartToBackend, removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      
      setItems([]);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, jwt, saveCartToBackend]);

  const handleAddressSave = useCallback(async (address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }) => {
    await saveAddressToBackend(address);
    
    // After saving address, add the pending cart item if exists
    if (pendingCartItem) {
      await addToCartDirectly(pendingCartItem);
      setPendingCartItem(null);
    } else if (items.length > 0) {
      // If no pending item but cart has items, redirect to checkout
      setIsCartOpen(false);
      window.location.href = '/checkout';
    }
  }, [saveAddressToBackend, pendingCartItem, addToCartDirectly, items.length]);

  const showCheckoutOTP = useCallback(() => {
    setPendingCartItem(null); // No pending item, just for checkout
    setIsCartOpen(false); // Close cart drawer when OTP modal opens
    setShowOTPModal(true);
  }, []);

  const value = useMemo<CartContextType>(() => ({
    items,
    totalItems,
    totalPrice,
    isLoading,
    isCartOpen,
    setIsCartOpen,
    showCheckoutOTP,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
  }), [items, totalItems, totalPrice, isLoading, isCartOpen, showCheckoutOTP, addToCart, removeFromCart, updateQuantity, clearCart, syncCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <PhoneOTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setPendingCartItem(null);
        }}
        onSuccess={handleOTPSuccess}
      />
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setPendingCartItem(null);
        }}
        onSave={handleAddressSave}
        initialPhone={userPhone}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

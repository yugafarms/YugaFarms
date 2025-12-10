'use client'
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

type PaymentMethod = 'COD' | 'RAZORPAY';

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayPaymentFailedResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
};

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
}

interface RazorpayInstance {
  on: (event: string, handler: (response: RazorpayPaymentFailedResponse) => void) => void;
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, showCheckoutOTP } = useCart();
  const { user, jwt } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Show OTP modal if user is not logged in
  useEffect(() => {
    if (!user && items.length > 0) {
      showCheckoutOTP();
    }
  }, [user, items.length, showCheckoutOTP]);

  // Address states
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [orderNotes, setOrderNotes] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Calculate totals
  const tax = 0;
  const shipping = 0;
  const finalTotal = Math.max(0, totalPrice + tax + shipping - discount);

  const loadUserAddress = useCallback(async () => {
    if (!jwt) return;

    try {
      const response = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.AddressLine1) {
          setShippingAddress({
            fullName: userData.username || '',
            phone: userData.Phone?.toString() || '',
            addressLine1: userData.AddressLine1 || '',
            addressLine2: userData.AddressLine2 || '',
            city: userData.City || '',
            state: userData.State || '',
            pincode: userData.Pin?.toString() || '',
            landmark: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading user address:', error);
    }
  }, [jwt]);

  const verifyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      setDiscount(0);
      setAppliedCoupon(null);
      return;
    }

    try {
      const response = await fetch(`${BACKEND}/api/coupons?filters[Code][$eq]=${couponCode}`, {
        headers: {
          'Authorization': `Bearer ${jwt}` // Using jwt if available, though finding coupons might be public depending on Strapi permissions
        }
      });

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        setCouponError('Invalid coupon code');
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      const coupon = data.data[0]; // Assuming Code is unique
      const couponAttributes = coupon.attributes || coupon; // Handle both structure formats if flattening is enabled/disabled
      const couponId = coupon.id;

      // Validate Expiry
      if (new Date() > new Date(couponAttributes.Expiry)) {
        setCouponError('Coupon has expired');
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      // Validate Count
      if (couponAttributes.Count <= 0) {
        setCouponError('Coupon usage limit reached');
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      // Calculate Discount
      let calculatedDiscount = 0;
      const couponValue = Number(couponAttributes.Value);

      if (couponAttributes.Percentage) {
        calculatedDiscount = (totalPrice * couponValue) / 100;
      } else {
        calculatedDiscount = couponValue;
      }

      // Cap discount to subtotal
      calculatedDiscount = Math.min(calculatedDiscount, totalPrice);

      setDiscount(calculatedDiscount);
      setAppliedCoupon({ id: couponId, ...couponAttributes });
      setCouponSuccess(`Coupon applied! You saved ₹${calculatedDiscount.toFixed(2)}`);

    } catch (error) {
      console.error('Coupon verification error:', error);
      setCouponError('Failed to verify coupon');
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Redirect if user is not logged in
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Load user's saved address if available
    if (user) {
      loadUserAddress();
    }
  }, [items, user, router, loadUserAddress]);

  const validateAddress = (address: Address): string[] => {
    const errors: string[] = [];

    if (!address.fullName.trim()) errors.push('Full name is required');
    if (!address.phone.trim()) errors.push('Phone number is required');
    if (!address.addressLine1.trim()) errors.push('Address line 1 is required');
    if (!address.city.trim()) errors.push('City is required');
    if (!address.state.trim()) errors.push('State is required');
    if (!address.pincode.trim()) errors.push('Pincode is required');

    // Phone validation - strip +91 and non-digits, then validate
    const cleanPhone = address.phone.replace(/\D/g, '').replace(/^91/, '');
    if (address.phone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    // Pincode validation
    if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
      errors.push('Please enter a valid 6-digit pincode');
    }

    return errors;
  };

  const handleAddressSubmit = () => {
    const shippingErrors = validateAddress(shippingAddress);
    const billingErrors = useSameAddress ? [] : validateAddress(billingAddress);

    if (shippingErrors.length > 0 || billingErrors.length > 0) {
      alert('Please fix the following errors:\n' + [...shippingErrors, ...billingErrors].join('\n'));
      return;
    }

    setCurrentStep(2);
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);

    try {
      if (paymentMethod === 'COD') {
        await createOrder();
      } else {
        await initiateRazorpayPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    if (!jwt) {
      throw new Error('You must be logged in to create an order');
    }

    // Clean phone numbers - ensure only 10 digits are saved (no +91 prefix)
    const cleanShippingPhone = shippingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
    const cleanBillingPhone = useSameAddress
      ? cleanShippingPhone
      : billingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);

    const orderData = {
      items: items,
      shippingAddress: {
        ...shippingAddress,
        phone: cleanShippingPhone
      },
      billingAddress: useSameAddress
        ? { ...shippingAddress, phone: cleanShippingPhone }
        : { ...billingAddress, phone: cleanBillingPhone },
      subtotal: totalPrice,
      tax: tax,
      shipping: shipping,
      total: finalTotal,
      paymentMethod: paymentMethod,
      notes: orderNotes,
      user: user?.id,
      coupon: appliedCoupon?.id
    };

    const response = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ data: orderData })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Failed to create order');
    }

    const order = await response.json();

    // Clear cart and redirect to success page
    await clearCart();
    router.push(`/order-success/${order.data.id}`);
  };

  const initiateRazorpayPayment = async () => {
    if (!jwt) {
      throw new Error('You must be logged in to create an order');
    }

    // Clean phone numbers - ensure only 10 digits are saved (no +91 prefix)
    const cleanShippingPhone = shippingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
    const cleanBillingPhone = useSameAddress
      ? cleanShippingPhone
      : billingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);

    // Create order first
    const orderData = {
      items: items,
      shippingAddress: {
        ...shippingAddress,
        phone: cleanShippingPhone
      },
      billingAddress: useSameAddress
        ? { ...shippingAddress, phone: cleanShippingPhone }
        : { ...billingAddress, phone: cleanBillingPhone },
      subtotal: totalPrice,
      tax: tax,
      shipping: shipping,
      total: finalTotal,
      paymentMethod: paymentMethod,
      notes: orderNotes,
      user: user?.id,
      coupon: appliedCoupon?.id
    };

    const response = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ data: orderData })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Failed to create order');
    }

    const order = await response.json();

    // Check if Razorpay is properly configured on frontend
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'your_razorpay_key_id_here') {
      alert('Razorpay is not configured on the frontend. Please contact support.');
      return;
    }

    // Check if we have a valid Razorpay order ID from backend
    if (!order.data.razorpayOrderId) {
      alert('Razorpay order creation failed. Please try again or use COD.');
      return;
    }

    // Check if Razorpay script is loaded
    if (typeof window === 'undefined' || !window.Razorpay) {
      alert('Razorpay payment gateway is not loaded. Please refresh the page and try again.');
      return;
    }

    // Initialize Razorpay payment
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(finalTotal * 100), // Amount in paise, rounded to integer
      currency: 'INR',
      name: 'YugaFarms',
      description: `Order #${order.data.orderNumber}`,
      order_id: order.data.razorpayOrderId,
      handler: async function (response: RazorpayPaymentResponse) {
        // Payment successful
        await handlePaymentSuccess(order.data.id, response);
      },
      prefill: {
        name: shippingAddress.fullName,
        email: user?.email,
        contact: shippingAddress.phone,
      },
      notes: {
        order_id: order.data.id,
        order_number: order.data.orderNumber
      },
      theme: {
        color: '#4b2e19'
      }
    };

    try {
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response: RazorpayPaymentFailedResponse) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || 'Please try again.'}`);
      });

      razorpay.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      alert('Payment gateway initialization failed. Please refresh the page and try again.');
    }
  };

  const handlePaymentSuccess = async (orderId: number, paymentResponse: RazorpayPaymentResponse) => {
    try {
      if (!jwt) {
        throw new Error('You must be logged in to confirm payment');
      }

      const response = await fetch(`${BACKEND}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpaySignature: paymentResponse.razorpay_signature
          }
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error?.message || 'Failed to confirm payment');
      }

      // Clear cart and redirect to success page
      await clearCart();
      router.push(`/order-success/${orderId}`);
    } catch (error) {
      console.error('Payment confirmation error:', error);
      alert(error instanceof Error ? error.message : 'Payment confirmation failed. Please contact support.');
    }
  };

  if (items.length === 0 || !user) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading checkout...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Checkout</h1>
            <p className="text-lg text-[#2D2D2D]/70">
              Complete your order in {currentStep === 1 ? '2' : '1'} step{currentStep === 1 ? 's' : ''}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= 1 ? 'bg-[#4b2e19] border-[#4b2e19] text-white' : 'border-[#4b2e19]/30 text-[#4b2e19]/30'
                }`}>
                <span className="text-sm font-semibold">1</span>
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-[#4b2e19]' : 'bg-[#4b2e19]/30'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= 2 ? 'bg-[#4b2e19] border-[#4b2e19] text-white' : 'border-[#4b2e19]/30 text-[#4b2e19]/30'
                }`}>
                <span className="text-sm font-semibold">2</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 ? (
                /* Address Form */
                <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-[#4b2e19] mb-6">Shipping Address</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                          className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Phone Number *</label>
                        <div className="flex items-center border border-[#4b2e19]/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5d26a]/50 focus-within:border-[#f5d26a]">
                          <span className="px-4 py-3 bg-[#f5d26a]/10 text-[#4b2e19] font-semibold border-r border-[#4b2e19]/20">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={shippingAddress.phone.replace(/\D/g, '').replace(/^91/, '')}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
                              setShippingAddress({ ...shippingAddress, phone: digits });
                            }}
                            className="flex-1 px-4 py-3 focus:outline-none"
                            placeholder="9876543210"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Address Line 1 *</label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine1}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                        className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                        placeholder="House/Flat No., Building Name, Street"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine2}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                        className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                        placeholder="Area, Colony, Locality"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">City *</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">State *</label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Pincode *</label>
                        <input
                          type="text"
                          value={shippingAddress.pincode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                          className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                          placeholder="Pincode"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={shippingAddress.landmark}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                        className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                        placeholder="Nearby landmark for easy delivery"
                      />
                    </div>

                    {/* Billing Address */}
                    <div className="border-t border-[#4b2e19]/10 pt-6">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sameAddress"
                          checked={useSameAddress}
                          onChange={(e) => setUseSameAddress(e.target.checked)}
                          className="w-4 h-4 text-[#4b2e19] border-[#4b2e19]/20 rounded focus:ring-[#f5d26a]/50"
                        />
                        <label htmlFor="sameAddress" className="ml-2 text-sm font-semibold text-[#2D2D2D]">
                          Use same address for billing
                        </label>
                      </div>

                      {!useSameAddress && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-[#4b2e19]">Billing Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Full Name *</label>
                              <input
                                type="text"
                                value={billingAddress.fullName}
                                onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                                className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Phone Number *</label>
                              <div className="flex items-center border border-[#4b2e19]/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5d26a]/50 focus-within:border-[#f5d26a]">
                                <span className="px-4 py-3 bg-[#f5d26a]/10 text-[#4b2e19] font-semibold border-r border-[#4b2e19]/20">
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  value={billingAddress.phone.replace(/\D/g, '').replace(/^91/, '')}
                                  onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
                                    setBillingAddress({ ...billingAddress, phone: digits });
                                  }}
                                  className="flex-1 px-4 py-3 focus:outline-none"
                                  placeholder="9876543210"
                                  maxLength={10}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Similar fields for billing address */}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Order Notes (Optional)</label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={3}
                        className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleAddressSubmit}
                      className="bg-[#4b2e19] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Method Selection */
                <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-[#4b2e19] mb-6">Payment Method</h2>

                  <div className="space-y-4 mb-8">
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-[#4b2e19] bg-[#4b2e19]/5' : 'border-[#4b2e19]/20 hover:border-[#4b2e19]/40'
                        }`}
                      onClick={() => setPaymentMethod('RAZORPAY')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="RAZORPAY"
                          checked={paymentMethod === 'RAZORPAY'}
                          onChange={() => setPaymentMethod('RAZORPAY')}
                          className="w-4 h-4 text-[#4b2e19] border-[#4b2e19]/20 rounded focus:ring-[#f5d26a]/50"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">💳</span>
                            <div>
                              <h3 className="font-semibold text-[#4b2e19]">Online Payment</h3>
                              <p className="text-sm text-[#2D2D2D]/70">Pay securely with Razorpay (Cards, UPI, Net Banking)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="border-2 border-[#4b2e19] text-[#4b2e19] px-8 py-3 rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300"
                    >
                      Back to Address
                    </button>
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={isLoading}
                      className="bg-[#4b2e19] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-[#4b2e19] mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-[#2D2D2D] text-sm">{item.productTitle}</p>
                        <p className="text-xs text-[#2D2D2D]/70">{item.weight}g × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#4b2e19]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}

                  <div className="border-t border-[#4b2e19]/10 pt-4 pb-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon Code"
                        className="flex-1 border border-[#4b2e19]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50"
                      />
                      <button
                        onClick={verifyCoupon}
                        className="bg-[#4b2e19] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2f4f2f] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                    {couponSuccess && <p className="text-green-600 text-xs mt-1">{couponSuccess}</p>}
                  </div>

                  <div className="border-t border-[#4b2e19]/10 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#2D2D2D]/70">Subtotal</span>
                      <span className="font-semibold">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2D2D2D]/70">Tax (18%)</span>
                      <span className="font-semibold">₹{tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2D2D2D]/70">Shipping</span>
                      <span className="font-semibold text-green-600">
                        ₹0
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-[#2D2D2D]/70">Discount</span>
                        <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-[#4b2e19]/10 pt-2">
                      <div className="flex justify-between">
                        <span className="text-xl font-bold text-[#4b2e19]">Total</span>
                        <span className="text-xl font-bold text-[#4b2e19]">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-[#f5d26a]/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-[#4b2e19] text-center">
                      Add ₹{699 - totalPrice} more for free shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

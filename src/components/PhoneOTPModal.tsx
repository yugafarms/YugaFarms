"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

type PhoneOTPModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
};

export default function PhoneOTPModal({ isOpen, onClose, onSuccess }: PhoneOTPModalProps) {
  const { sendOTP, loginWithOTP } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate phone number (should be exactly 10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      // Add +91 prefix for OTP sending
      const fullPhone = `+91${cleanPhone}`;
      await sendOTP(fullPhone);
      setStep("otp");
      setCountdown(60); // 60 second countdown
      
      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = `+91${cleanPhone}`;
      await loginWithOTP(fullPhone, otp);
      onSuccess(fullPhone);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setError(null);
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = `+91${cleanPhone}`;
      await sendOTP(fullPhone);
      setCountdown(60);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setError(null);
    setCountdown(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#2D2D2D]/50 hover:text-[#2D2D2D] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#4b2e19] mb-2">
            {step === "phone" ? "Enter Your Phone Number" : "Enter OTP"}
          </h2>
          <p className="text-sm text-[#2D2D2D]/70">
            {step === "phone"
              ? "We'll send you a verification code"
              : `We've sent a 6-digit code to +91 ${phone}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                Phone Number
              </label>
              <div className="flex items-center border border-[#4b2e19]/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5d26a]/50 focus-within:border-[#f5d26a]">
                <span className="px-4 py-3 bg-[#f5d26a]/10 text-[#4b2e19] font-semibold border-r border-[#4b2e19]/20">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(digits);
                  }}
                  placeholder="9876543210"
                  maxLength={10}
                  className="flex-1 px-4 py-3 focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className="text-sm text-[#4b2e19] hover:text-[#2f4f2f] disabled:text-[#2D2D2D]/30 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-sm text-[#2D2D2D]/70 hover:text-[#2D2D2D] transition-colors"
            >
              Change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


"use client"
import React from 'react'
import TopBar from "@/components/TopBar"
import Footer from "@/components/Footer"

export default function ShippingPolicyPage() {
  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
        {/* Hero */}
        <div className="relative pt-16 md:pt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block relative">
                <h1 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-3 md:mb-4">
                  Shipping & Delivery <span className="text-[#f5d26a]">Policy</span>
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 md:w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
              </div>
              <p className="text-base md:text-xl text-[#2D2D2D]/70 mt-5 max-w-4xl mx-auto leading-relaxed">
                We partner with reliable courier services to deliver across India and select international locations.
              </p>
            </div>
          </div>
        </div>

        {/* Wave into content */}
        <div aria-hidden className="relative z-20 -mt-2">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
            <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* Policy content */}
        <section className="py-12 md:py-16 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-[#4b2e19]/10">
              <div className="space-y-8 md:space-y-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">1. Shipping Method</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We currently offer standard shipping for all orders. Our shipping process is designed to provide a
                    dependable and efficient delivery experience while maintaining the quality and integrity of our
                    products.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">2. Delivery Timeline</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Delivery times vary depending on your location and courier availability. Orders are typically
                    delivered within 2 to 15 business days from the date of dispatch. External factors such as weather,
                    courier delays, or regional restrictions may occasionally impact delivery timelines.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">3. Shipping Coverage</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Our courier partners enable delivery to most pin codes across India and select international
                    destinations. If your location falls outside our current delivery network, we will contact you to
                    arrange an alternative option or issue a full refund.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">4. Order Tracking</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Once your order has been shipped, you will receive a tracking ID and courier details via email or
                    WhatsApp. Use this information to monitor the status of your delivery in real time.
                  </p>
                </div>

                <div className="border-t border-[#4b2e19]/10 pt-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">5. Customer Support</h2>
                  <p className="text-[#2D2D2D]/80">
                    For any queries related to shipping and delivery, contact our Customer Support Team at
                    {" "}
                    <a href="mailto:yugafarms@gmail.com" className="text-[#2f4f2f] font-medium underline underline-offset-4 hover:text-[#4b2e19]">yugafarms@gmail.com</a>.
                  </p>
                  <p className="text-xs text-[#2D2D2D]/60 mt-3">Last updated: Nov 2025</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave back to cream before Footer */}
        <div aria-hidden className="relative z-20 -mt-2 bg-[#fdf7f2]">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
            <path d="M0,40 C120,80 240,0 360,40 S600,80 720,40 960,0 1080,40 1320,80 1440,40 L1440,0 L0,0 Z"></path>
          </svg>
        </div>
      </main>
      <Footer />
    </>
  )
}
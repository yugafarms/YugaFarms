"use client"
import React from 'react'
import TopBar from "@/components/TopBar"
import Footer from "@/components/Footer"

export default function RefundPolicyPage() {
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
                                    Refund & Return <span className="text-[#f5d26a]">Policy</span>
                                </h1>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 md:w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
                            </div>
                            <p className="text-base md:text-xl text-[#2D2D2D]/70 mt-5 max-w-4xl mx-auto leading-relaxed">
                                We take pride in offering premium-quality ghee and honey. To maintain freshness,
                                quality, and hygiene, we follow the guidelines below.
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
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">1. No Returns</h2>
                                    <p className="text-[#2D2D2D]/80 leading-relaxed">
                                        Due to the perishable nature of our ghee and honey products, we are unable to accept returns once an order has been delivered. This helps us maintain our high-quality standards and ensures that every product reaches you in optimal condition.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">2. Damaged or Defective Products</h2>
                                    <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                                        <li>Please contact our support team within 2 days of delivery.</li>
                                        <li>We may request clear photographs of the affected item.</li>
                                        <li>Upon verification, we may offer a refund or replacement depending on the circumstances.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">3. Incorrect Items</h2>
                                    <p className="text-[#2D2D2D]/80 leading-relaxed">
                                        If you receive an incorrect item, please notify us within 2 days of receiving your order. We will arrange for the correct product to be sent to you as soon as possible. If the correct item is unavailable, a refund will be issued.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">4. Refund Process</h2>
                                    <p className="text-[#2D2D2D]/80 leading-relaxed mb-3">To request a refund, email us with the following details:</p>
                                    <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                                        <li>Your order number</li>
                                        <li>A brief description of the issue</li>
                                        <li>Relevant photos, if applicable</li>
                                    </ul>
                                    <p className="text-[#2D2D2D]/80 leading-relaxed mt-3">
                                        Once reviewed and approved, refunds are typically processed within 7 business days. Additional time may be required by your bank or payment provider to reflect the amount.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">5. Exchanges</h2>
                                    <p className="text-[#2D2D2D]/80 leading-relaxed">
                                        We do not offer product exchanges. In cases involving damage, defects, or incorrect items, we will provide a replacement or refund in accordance with this policy.
                                    </p>
                                </div>

                                <div className="border-t border-[#4b2e19]/10 pt-6">
                                    <h3 className="text-xl md:text-2xl font-semibold text-[#4b2e19] mb-2">Need Assistance?</h3>
                                    <p className="text-[#2D2D2D]/80">
                                        For any questions or support, contact our Customer Support Team at
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
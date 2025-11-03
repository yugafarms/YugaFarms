"use client"
import React from 'react'
import TopBar from "@/components/TopBar"
import Footer from "@/components/Footer"

export default function PrivacyPolicyPage() {
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
                  Privacy <span className="text-[#f5d26a]">Policy</span>
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 md:w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
              </div>
              <p className="text-base md:text-xl text-[#2D2D2D]/70 mt-5 max-w-4xl mx-auto leading-relaxed">
                This Privacy Policy explains what information we collect, how we use it, and your choices.
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
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">1. Scope</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    This Policy applies to information collected on our website and related services provided by Yuga Farms (“we”, “us”, “our”). By using our site, you agree to this Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">2. Information We Collect</h2>
                  <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                    <li>Account and contact details: name, email, phone, shipping/billing addresses.</li>
                    <li>Order information: products purchased, preferences, and order history.</li>
                    <li>Technical data: IP address, device, browser, and analytics events.</li>
                    <li>Communications: messages you send to us (email, forms, support).</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">3. How We Use Information</h2>
                  <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                    <li>To process and deliver orders, payments, and updates.</li>
                    <li>To provide customer support and respond to inquiries.</li>
                    <li>To improve our products, services, and website performance.</li>
                    <li>To send service communications; marketing only with consent or as permitted by law.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">4. Sharing of Information</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We share data with trusted service providers (e.g., payment gateways, shipping partners, analytics) strictly to operate our services. We do not sell your personal information. We may disclose data if required by law or to protect our rights.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">5. Data Retention</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We retain personal information for as long as necessary to fulfill the purposes described above, comply with legal obligations, resolve disputes, and enforce agreements.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">6. Security</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We implement administrative and technical safeguards designed to protect personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">7. Your Rights & Choices</h2>
                  <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                    <li>Access, update, or correct your information.</li>
                    <li>Request deletion, subject to legal/legitimate retention obligations.</li>
                    <li>Opt out of marketing communications at any time.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">8. Cookies & Tracking</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We use cookies and similar technologies to remember preferences, keep you signed in, and analyze usage. You can control cookies through your browser settings; disabling some cookies may affect site functionality.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">9. Children’s Privacy</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Our services are not directed to children under the age of 13. If you believe a child has provided us personal information, please contact us so we can take appropriate action.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">10. Updates to This Policy</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We may update this Policy from time to time. We will post the updated Policy on this page with the revised date. Continued use of the site after changes means you accept the updated Policy.
                  </p>
                </div>

                <div className="border-t border-[#4b2e19]/10 pt-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">11. Contact Us</h2>
                  <p className="text-[#2D2D2D]/80">
                    For questions or requests regarding this Policy, contact
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
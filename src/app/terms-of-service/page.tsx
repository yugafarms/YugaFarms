"use client"
import React from 'react'
import TopBar from "@/components/TopBar"
import Footer from "@/components/Footer"

export default function TermsOfServicePage() {
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
                  Terms <span className="text-[#f5d26a]">& Conditions</span>
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 md:w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
              </div>
              <p className="text-base md:text-xl text-[#2D2D2D]/70 mt-5 max-w-4xl mx-auto leading-relaxed">
                By accessing or using our website, you agree to these Terms. If you do not
                agree, please discontinue use of the site and services.
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

        {/* Terms content */}
        <section className="py-12 md:py-16 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-[#4b2e19]/10">
              <div className="space-y-8 md:space-y-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">1. Acceptance of Terms</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    This website is operated by Yuga Farms (“we”, “us”, “our”). By using our website you agree to
                    these Terms. New features or tools added to the store are also subject to these Terms. We may
                    update the Terms at any time; continued use signifies acceptance.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">2. Online Store Terms</h2>
                  <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                    <li>You confirm you are of legal age in your jurisdiction, or have guardian consent.</li>
                    <li>You will not use our products for illegal or unauthorized purposes.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">3. General Conditions</h2>
                  <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                    <li>We may refuse service to anyone at any time.</li>
                    <li>Non-card data may be transmitted unencrypted across networks; card data is always encrypted.</li>
                    <li>Do not reproduce, resell, or exploit the Service without our written permission.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">4. Information Accuracy</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Materials on the site are for general information and may not be accurate, complete, or current.
                    Do not rely solely on them for decisions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">5. Service and Price Changes</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Product prices may change without notice. We may modify or discontinue the Service at any time
                    without liability.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">6. Products or Services</h2>
                  <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                    <li>Some products may be available exclusively online.</li>
                    <li>We aim to display colors/images accurately, but cannot guarantee exact device rendering.</li>
                    <li>We may limit quantities of any product or service.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">7. Billing and Account Information</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We may refuse or cancel any order. Provide current, complete, and accurate purchase and account
                    information and promptly update it as needed.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">8. Optional Tools</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Access to third‑party tools is provided “as is.” Use is at your own risk and governed by the
                    third parties’ terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">9. Third‑Party Links</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We are not responsible for third‑party materials, products, or services linked from our site.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">10. Comments and Feedback</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    Submissions may be edited, copied, published, or used by us without restriction. We are not
                    obligated to maintain comments in confidence, compensate, or respond.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">11. Personal Information</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">Your information is governed by our Privacy Policy.</p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">12. Errors and Omissions</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We may correct typographical errors, inaccuracies, or omissions and update information without
                    prior notice.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">13. Prohibited Uses</h2>
                  <ul className="list-disc pl-5 text-[#2D2D2D]/80 space-y-2">
                    <li>Unlawful activities or solicitation of unlawful acts</li>
                    <li>Violations of regulations or laws; harassment, abuse, defamation, discrimination</li>
                    <li>Submitting false or misleading information; uploading malicious code</li>
                    <li>Interfering with security features of the Service</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">14. Warranties and Liability</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We do not warrant uninterrupted, timely, secure, or error‑free service. Use is at your own risk.
                    To the fullest extent permitted by law, we are not liable for direct or consequential damages
                    arising from the use of the website or products.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">15. Indemnification</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    You agree to indemnify and hold harmless Yuga Farms and our affiliates and agents from claims
                    arising from your breach of these Terms or violation of law or third‑party rights.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">16. Severability</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    If any provision is unlawful or unenforceable, it shall be enforced to the maximum extent
                    permitted, and the remaining provisions remain in effect.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">17. Termination</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">
                    We may terminate access without notice for any breach. Obligations and liabilities incurred prior
                    to termination survive.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">18. Entire Agreement</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">These Terms constitute the entire agreement between you and Yuga Farms.</p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">19. Governing Law</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">These Terms are governed by the laws of India.</p>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-3">20. Changes to Terms</h2>
                  <p className="text-[#2D2D2D]/80 leading-relaxed">We may update these Terms at any time. Continued use constitutes acceptance.</p>
                </div>

                <div className="border-t border-[#4b2e19]/10 pt-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#4b2e19] mb-2">21. Contact</h3>
                  <p className="text-[#2D2D2D]/80">
                    Questions about the Terms? Email us at
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
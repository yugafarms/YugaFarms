'use client'
import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export default function ContactPage() {
  const { user, jwt } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Fetch user details and pre-fill form if logged in
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && jwt) {
        try {
          setIsLoadingUser(true);
          const response = await fetch(`${BACKEND}/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setFormData(prev => ({
              ...prev,
              name: userData.username || prev.name,
              email: userData.email || prev.email,
              phone: userData.Phone || prev.phone,
            }));
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setIsLoadingUser(false);
        }
      }
    };

    fetchUserDetails();
  }, [user, jwt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Convert phone to integer (remove non-numeric characters)
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        setErrorMessage('Please enter a valid phone number (at least 10 digits)');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
      const phoneNumber = parseInt(cleanPhone, 10);
      
      if (isNaN(phoneNumber)) {
        setErrorMessage('Please enter a valid phone number');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data according to schema
      const inquiryData = {
        Name: formData.name,
        Email: formData.email || null,
        Phone: phoneNumber,
        Subject: formData.subject,
        Messages: formData.message
      };

      const response = await fetch(`${BACKEND}/api/inquires`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(jwt && { 'Authorization': `Bearer ${jwt}` })
        },
        body: JSON.stringify({ data: inquiryData })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || errorData?.message || 'Failed to submit inquiry';
        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }

      setSubmitStatus('success');
      
      // Reset form but keep user data if logged in
      if (user && jwt) {
        try {
          const userResponse = await fetch(`${BACKEND}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${jwt}` }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setFormData({
              name: userData.username || '',
              email: userData.email || '',
              phone: userData.Phone || '',
              subject: '',
              message: ''
            });
          } else {
            setFormData({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: ''
            });
          }
        } catch {
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
        }
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
        {/* Hero Section */}
        <div className="relative pt-16 md:pt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block relative">
                <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4 transition-all duration-700 hover:scale-105">
                  Get in <span className="text-[#f5d26a]">Touch</span>
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
              </div>
              <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-300">
                We&apos;d love to hear from you! Whether you have a question, feedback, or just want to say hello, 
                our team is here to help. Reach out to us and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Wave into Contact Content */}
        <div aria-hidden className="relative z-20 -mt-2">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
            <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* Contact Section */}
        <section className="py-20 md:py-24 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side - Contact Form */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#4b2e19] mb-6">Send us a Message</h2>
                  
                  {isLoadingUser && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800">Loading your information...</p>
                    </div>
                  )}

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{errorMessage || 'Oops! Something went wrong. Please try again later.'}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[#4b2e19] mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#4b2e19]/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#4b2e19] mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#4b2e19]/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] focus:border-transparent transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#4b2e19] mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#4b2e19]/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] focus:border-transparent transition-all duration-300"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-[#4b2e19] mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#4b2e19]/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="product">Product Question</option>
                        <option value="order">Order Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-[#4b2e19] mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-[#4b2e19]/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#4b2e19] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#2f4f2f] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>

                {/* Right Side - Contact Information */}
                <div className="space-y-6">
                  {/* Contact Info Cards */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ffe189] to-[#ffd93f] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg">
                        <svg className="w-8 h-8 text-[#4b2e19]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">Email Us</h3>
                        <p className="text-[#2D2D2D]/80 mb-1">Drop us a line anytime</p>
                        <a href="mailto:support@yugafarms.com" className="text-[#4b2e19] hover:text-[#2f4f2f] font-medium transition-colors">
                          support@yugafarms.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ffe189] to-[#ffd93f] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg">
                        <svg className="w-8 h-8 text-[#4b2e19]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">Call Us</h3>
                        <p className="text-[#2D2D2D]/80 mb-1">Mon - Sat, 9:00 AM - 6:00 PM</p>
                        <a href="tel:+919671012177" className="text-[#4b2e19] hover:text-[#2f4f2f] font-medium transition-colors">
                          +91 96710 12177
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ffe189] to-[#ffd93f] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg">
                        <svg className="w-8 h-8 text-[#4b2e19]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">Visit Us</h3>
                        <p className="text-[#2D2D2D]/80 mb-1">Come say hello at our location</p>
                        <p className="text-[#4b2e19] font-medium">
                          Janouli, Palwal,<br />
                          Haryana, 121102
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media / Additional Info */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-xl">
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-4">Response Time</h3>
                    <p className="text-[#2D2D2D]/80 leading-relaxed mb-4">
                      We typically respond to all inquiries within 24-48 hours during business days. 
                      For urgent matters, please call us directly.
                    </p>
                    <div className="space-y-2 text-sm text-[#2D2D2D]/70">
                      <p><span className="font-semibold text-[#4b2e19]">Business Hours:</span> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                      <p><span className="font-semibold text-[#4b2e19]">Closed:</span> Sundays and Public Holidays</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="py-20 md:py-24 bg-gradient-to-br from-[#fdf7f2] to-[#f8f4e6]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#4b2e19] mb-4">Find Us on Map</h2>
                <p className="text-[#2D2D2D]/70 text-lg">Visit our location in Janouli, Palwal, Haryana</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#4b2e19]/10 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-[#4b2e19] to-[#2f4f2f] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder for Google Maps - Replace with actual embed */}
                  <div className="text-white text-center z-10">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-lg font-semibold">Map Integration</p>
                    <p className="text-sm opacity-80 mt-2">Add Google Maps embed here</p>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-4 right-4 w-32 h-32 bg-[#f5d26a]/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-[#f5d26a]/10 rounded-full blur-xl"></div>
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
  );
}


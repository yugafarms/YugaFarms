import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-[#fdf7f2] pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.svg" alt="YugaFarms Logo" width={80} height={80} className="object-contain" />
                            {/* <span className="ml-2 font-[Pacifico] text-xl text-[#4b2e19]">YugaFarms</span> */}
                        </Link>
                        <p className="mt-3 text-sm text-[#2D2D2D]/70 max-w-xs">Pure, traditionally crafted ghee and oils made the slow way — from farm to your plate.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4b2e19] mb-3">Policies</h4>
                        <ul className="space-y-2 text-sm text-[#2D2D2D]/80">
                            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service">Terms of Service</Link></li>
                            <li><Link href="/shipping-policy">Shipping Policy</Link></li>
                            <li><Link href="/refund-policy">Refund & Returns</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4b2e19] mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-[#2D2D2D]/80">
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/recipes">Recipes</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/lab-reports">Lab Reports</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4b2e19] mb-3">Get in touch</h4>
                        <ul className="space-y-2 text-sm text-[#2D2D2D]/80">
                            <li>Email: support@yugafarms.com</li>
                            <li>Phone: +91 96710 12177</li>
                            <li>Address: Janouli, Palwal, Haryana, 121102</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#4b2e19]/10 text-xs text-[#2D2D2D]/60 flex flex-col md:flex-row items-center justify-between">
                    <span>© {new Date().getFullYear()} YugaFarms. All rights reserved.</span>
                    <div className="mt-2 md:mt-0 space-x-4">
                        Designed and Developed by <Link href="https://www.digicraft.one" className="text-[#2f4f2f] font-medium underline underline-offset-4 hover:text-[#4b2e19]">DigiCraft</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
'use client'
import React from "react";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function RecipesPage() {
  const recipes = [
    {
      title: "Breakfast Bowl",
      subtitle: "Nutty Banana Breakfast Bowl",
      description: "Kickstart your morning with a Nutty Banana Breakfast Bowl packed with nutrients. Combines the natural sweetness of bananas with the rich, creamy texture of our pure ghee for a perfect start to your day.",
      image: "/images/recipes/breakfast-bowl.png" // Place your image in public/images/recipes or update the path accordingly
    },
    {
      title: "Gajar Ka Halwa",
      subtitle: "Gajar ka Halwa",
      description: "A traditional Indian dessert that is rich, creamy, and absolutely irresistible. Made with fresh carrots, our premium ghee, and milk, this classic dessert brings warmth and comfort to any occasion.",
      image: "/images/recipes/gajar-halwa.png" // Place your image in public/images/recipes or update the path accordingly
    },
    {
      title: "Honey Roasted Peanuts",
      subtitle: "Honey Roasted Peanuts",
      description: "A quick and easy snack that's the perfect combination of sweet and savory. Our pure, natural honey coats each peanut with a golden glaze, creating a crunchy, flavorful treat perfect for any time of day.",
      image: "/images/recipes/honey-roasted-peanuts.png" // Place your image in public/images/recipes or update the path accordingly
    },
    {
      title: "Honey Glazed Carrots",
      subtitle: "Honey Glazed Carrots",
      description: "A simple yet flavorful side dish that's both nutritious and delicious. Our pure honey creates a beautiful caramelized glaze that enhances the natural sweetness of fresh carrots, perfect for any meal.",
      image: "/images/recipes/honey-glazed-carrots.png" // Place your image in public/images/recipes or update the path accordingly
    },
    {
      title: "Eggless Ghee Cake",
      subtitle: "Eggless Ghee Cake",
      description: "A moist and flavorful eggless cake made with our premium ghee. Rich and tender with a beautiful buttery flavor, perfect for any special occasion or when you want to treat yourself.",
      image: "/images/recipes/eggless-ghee-cake.png" // Place your image in public/images/recipes or update the path accordingly
    },
    {
      title: "Breakfast Crepes",
      subtitle: "Breakfast Crepes",
      description: "Light, thin, and delicately flavored crepes made with our pure ghee for a rich, buttery taste. Perfect for a leisurely weekend breakfast, filled with your favorite fruits, honey, or preserves.",
      image: "/images/recipes/breakfast-crepes.png" // Place your image in public/images/recipes or update the path accordingly
    }
  ];

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
         {/* Hero Section */}
         <div className="relative pt-16 md:pt-20">
           <div className="container mx-auto px-4">
             <div className="text-center mb-16">
               <div className="inline-block relative">
                 <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4">
                   Delicious <span className="text-[#f5d26a]">Recipes</span>
                 </h1>
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
               </div>
               <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-4xl mx-auto leading-relaxed">
                 Discover delightful recipes using our pure ghee and natural honey. From traditional Indian desserts 
                 to modern breakfast favorites, explore ways to incorporate our premium products into your daily cooking.
               </p>
             </div>
           </div>
         </div>

         {/* Wave into Recipes Section */}
         <div aria-hidden className="relative z-20 -mt-2">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
           </svg>
         </div>

        {/* Recipes Section */}
        <section className="py-16 md:py-20 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-none flex flex-col items-center backdrop-blur-sm transition-shadow duration-300"
                >
                  <div className="w-full flex-1 flex items-center justify-center p-4">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      width={400}
                      height={256}
                      className="rounded-xl object-cover w-full h-64"
                      style={{
                        background: "#fff",
                        borderRadius: "1.25rem",
                        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
                        marginTop: "8px",
                        marginBottom: "8px",
                      }}
                    />
                  </div>
                  <div className="w-full px-6 pb-6 flex-1 flex flex-col">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-2">
                      {recipe.title}
                    </h2>
                    <p className="text-[#2D2D2D]/70 leading-relaxed text-base flex-1">
                      {recipe.description}
                    </p>
                  </div>
                </div>
              ))}
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


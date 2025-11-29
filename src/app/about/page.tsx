'use client'
import React, { useEffect, useState, useRef } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AboutPage() {
  const [counters, setCounters] = useState({ years: 0, families: 0, natural: 0, generations: 0 });
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate counters
          const animateCounter = (target: number, key: keyof typeof counters, duration: number = 2000) => {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                setCounters(prev => ({ ...prev, [key]: target }));
                clearInterval(timer);
              } else {
                setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
              }
            }, 16);
          };

          animateCounter(10, 'years');
          animateCounter(2, 'families');
          animateCounter(100, 'natural');
          animateCounter(2, 'generations');
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
         {/* Hero Section with Video */}
         <div className="relative pt-16 md:pt-20">
           <div className="container mx-auto px-4">
             <div className="text-center mb-16">
               <div className="inline-block relative">
                 <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4 transition-all duration-700 hover:scale-105">
                   Our <span className="text-[#f5d26a]">Story</span>
                 </h1>
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
               </div>
               <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-300">
                 Reviving the ancient wisdom of Old Bharat, we bring you pure, traditional products crafted with the same love and dedication that our ancestors used for generations.
               </p>
             </div>

             {/* Video Section */}
             <div className="max-w-5xl mx-auto mb-20">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#f5d26a]/20 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group">
                 <div className="aspect-video bg-gradient-to-br from-[#4b2e19] to-[#2f4f2f] flex items-center justify-center">
                   {/* YouTube Video Placeholder - Replace with actual video ID */}
                   <iframe
                     className="w-full h-full rounded-2xl transition-all duration-500 group-hover:scale-105"
                     src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=example"
                     title="Our Farm Story - YugaFarms"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     allowFullScreen
                   ></iframe>
                 </div>
                 {/* Decorative Elements */}
                 <div className="absolute -top-6 -left-6 w-20 h-20 border-3 border-[#f5d26a]/40 rounded-full transition-all duration-500 group-hover:border-[#f5d26a]/60 group-hover:scale-110"></div>
                 <div className="absolute -bottom-6 -right-6 w-16 h-16 border-3 border-[#4b2e19]/30 rounded-full transition-all duration-500 group-hover:border-[#4b2e19]/50 group-hover:scale-110"></div>
                 <div className="absolute top-1/2 -left-3 w-12 h-12 border-2 border-[#2f4f2f]/20 rounded-full transition-all duration-500 group-hover:border-[#2f4f2f]/40 group-hover:scale-110"></div>
                 <div className="absolute top-1/4 -right-3 w-8 h-8 border-2 border-[#f5d26a]/30 rounded-full transition-all duration-500 group-hover:border-[#f5d26a]/50 group-hover:scale-110"></div>
               </div>
               
               {/* Video Caption */}
               <div className="text-center mt-6">
                 <p className="text-[#2D2D2D]/60 italic text-lg transition-all duration-500">
                 &quot;Watch our journey from farm to your table, preserving traditions that have nourished families for centuries.&quot;
                 </p>
               </div>
             </div>
           </div>
         </div>

         {/* Wave into About Content */}
         <div aria-hidden className="relative z-20 -mt-2">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
           </svg>
         </div>

        {/* Our Story Section */}
        <section className="py-20 md:py-24 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6 transition-all duration-700 hover:scale-105">Our Story</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Main Story Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-16 border border-[#4b2e19]/10 transition-all duration-500">
                <div className="space-y-6 text-[#2D2D2D]/80 leading-relaxed">
                  <p className="text-lg">
                    At Yuga Farms, our journey began with a question: in a world where everything moves faster, where meals are grabbed, packaged, processed, how well do we really know what we&apos;re eating? We watched as real food—grown and made with care—became overshadowed by convenience, shortcuts, and hidden processing.
                  </p>
                  
                  <p>
                    We remembered how it used to be: a spoon of warm ghee on simple chapati, the fragrance of golden clarity, the rhythm of seasons and soil and cow and kitchen all working together. We remembered how our elders knew what they were eating and how, how they respected the cow, the land, the churn, the flame.
                  </p>
                  
                  <p>
                    So we created Yuga Farms with one clear mission: to bring back right food—the kind our ancestors trusted—so that every home can hold onto the traditions of old Bharat, and every body can benefit from what genuine nourishment offers. Our focus is simple yet profound: cow ghee, crafted the way it was meant to be.
                  </p>
                  
                  <div className="mt-8">
                    <p className="font-semibold text-[#4b2e19] mb-4">Here&apos;s what we do differently:</p>
                    <ul className="space-y-3 list-none">
                      <li className="flex items-start gap-3">
                        <span className="text-[#f5d26a] font-bold mt-1">•</span>
                        <span>We raise our cows with dignity, on clean feed, free from the shortcuts of industrial production.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#f5d26a] font-bold mt-1">•</span>
                        <span>We churn and clarify the ghee using traditional, careful methods—so the flavour, the nutrients, the integrity remain. As one source explains: &quot;The Vedic method of preparing ghee … ensures the ghee retains its nutritional and medicinal properties while being free from harmful additives.&quot;</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#f5d26a] font-bold mt-1">•</span>
                        <span>We believe that modern manufacturing of fat and oils often loses the soul, the health, and the story of what food should be. That&apos;s why our ghee isn&apos;t just &quot;another cooking fat&quot; — it&apos;s a return to clarity, taste, roots, health.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#f5d26a] font-bold mt-1">•</span>
                        <span>Because research shows that cow ghee made with proper methods offers real benefits: for digestion, immunity, brain function and more.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="mt-6">
                    Whether you&apos;re sitting down with your family for a home-cooked meal, or pausing for a quiet celebration, or simply choosing how to nourish yourself on a busy day — Yuga Farms is here so that what you put on your plate does more than satisfy hunger. It honours the land, the cow, the churn, the tradition. It nourishes your body. It remembers your roots.
                  </p>
                  
                  <p className="mt-4 font-semibold text-[#4b2e19]">
                    Because for us at Yuga Farms — ghee isn&apos;t just a cooking fat. It&apos;s the golden thread between tradition and health. Between the old ways of Bharat and the mindful tomorrow we want for ourselves and our children.
                  </p>
                  
                  <p className="mt-4 italic text-center text-[#4b2e19]">
                    Yuga Farms — where tradition meets health; where genuine cow ghee meets care.
                  </p>
                </div>
              </div>

              {/* Heritage Stats */}
              <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-lg hover:scale-105 group">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">{counters.years}+</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Years of Tradition</div>
                </div>
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-lg hover:scale-105 group">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">{counters.families}K+</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Happy Families</div>
                </div>
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-lg hover:scale-105 group">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">{counters.natural}%</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Natural Products</div>
                </div>
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-lg hover:scale-105 group">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">{counters.generations}</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Generations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* A Note From Our Founders */}
        <section className="py-20 md:py-24 bg-gradient-to-br from-[#fdf7f2] to-[#f8f4e6]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6 transition-all duration-700 hover:scale-105">A Note From Our Founders</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#4b2e19]/10 transition-all duration-500">
                <div className="space-y-6 text-[#2D2D2D]/80 leading-relaxed">
                  <p className="text-lg">
                    We&apos;re <span className="font-semibold text-[#4b2e19]">Vishal & Deepak</span> — two friends inspired by India&apos;s food heritage and concerned about a world where meals are rushed and real nourishment is forgotten. In the rush of modern life, we asked: Do we really know what we&apos;re eating?
                  </p>
                  
                  <p>
                    At Yuga Farms, we&apos;ve chosen a different path. Our focus is clear: bring back the richness of tradition, health, and real flavour — starting with pure cow ghee made from the milk of our beloved indigenous Sahiwal cow.
                  </p>
                  
                  <p>
                    From pasture to churn to your plate, we&apos;re committed to food that honours the land, the animal, and your well-being. Because choosing our ghee isn&apos;t just about taste. It&apos;s about tradition, health and what we believe real food should be.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise Section */}
        <section className="py-20 md:py-24 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6 transition-all duration-700 hover:scale-105">Our Sacred Promise</h2>
              <p className="text-xl text-[#2D2D2D]/70 max-w-4xl mx-auto leading-relaxed transition-all duration-700 delay-300">
                To you, our extended family, we make these solemn commitments that guide every decision we make, 
                every product we create, and every relationship we build.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  {
                    icon: "/about/natural.png",
                    title: "100% Natural Ingredients",
                    description: "We use only the finest, whole ingredients in all our products. No artificial additives, no preservatives, no shortcuts. Every ingredient is carefully selected for its purity and nutritional value, just as nature intended.",
                    highlight: "Pure & Natural"
                  },
                  {
                    icon: "/about/traditional.png",
                    title: "Traditional Methods",
                    description: "We adhere to time-honored processes, even when they require more effort and time. Our bilona churning method for ghee and gentle extraction for honey preserve the authentic taste and health benefits that modern methods cannot replicate.",
                    highlight: "Time-Tested"
                  },
                  {
                    icon: "/about/animal.png",
                    title: "Animal Welfare",
                    description: "Our cows graze freely on open pastures, eat natural grass and feed, and are never given synthetic hormones or antibiotics. We believe that happy, healthy animals produce the finest, most nutritious products.",
                    highlight: "Ethical Sourcing"
                  },
                  {
                    icon: "/about/community.png",
                    title: "Community First",
                    description: "We work directly with small family farms and local communities, ensuring fair trade practices and supporting the livelihoods of those who have preserved these traditional methods for generations.",
                    highlight: "Fair Trade"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#4b2e19]/10 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                        <Image src={item.icon} alt={item.title} width={64} height={64} className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">{item.title}</h3>
                          <span className="inline-block bg-[#f5d26a]/20 text-[#4b2e19] px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 group-hover:bg-[#f5d26a]/30">
                            {item.highlight}
                          </span>
                        </div>
                        <p className="text-[#2D2D2D]/80 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-20 md:py-24 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6 transition-all duration-700 hover:scale-105">The Art of Creation</h2>
              <p className="text-xl text-[#2D2D2D]/70 max-w-4xl mx-auto leading-relaxed transition-all duration-700 delay-300">
                Every product we create follows a sacred ritual that has been passed down through generations. 
                This is not just a process - it&apos;s a meditation, a prayer, a celebration of nature&apos;s gifts.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="space-y-16">
                {[
                  {
                    step: "01",
                    title: "Sacred Sourcing",
                    description: "We begin at dawn, visiting our trusted partner farms where cows graze freely on organic pastures. We select only the finest, freshest milk from grass-fed cows and pure honey from specific flower sources, ensuring each ingredient carries the essence of its natural environment.",
                    icon: "/images/sacredsourcing.png",
                    detail: "Farm Visits at Dawn"
                  },
                  {
                    step: "02", 
                    title: "Traditional Preparation",
                    description: "In our traditional kitchen, we use the ancient bilona churning method for ghee - a slow, rhythmic process that takes hours but preserves every nutrient. For honey, we practice gentle extraction that maintains the natural enzymes and pollen that make it truly beneficial.",
                    icon: "/images/traditionalpreparation.png",
                    detail: "Hand-Churned for Hours"
                  },
                  {
                    step: "03",
                    title: "Rigorous Testing",
                    description: "Every batch undergoes comprehensive testing in our laboratory to ensure purity, authenticity, and nutritional value. We test for adulteration, check nutritional content, and verify that our products meet the highest standards of quality and safety.",
                    icon: "/images/rigoroustesting.png",
                    detail: "Lab Tested & Verified"
                  },
                  {
                    step: "04",
                    title: "Blessed Packaging",
                    description: "Each product is carefully packaged in food-grade containers that preserve freshness and purity. We treat this final step as a blessing, ensuring that when our products reach your home, they carry the same love and care with which they were created.",
                    icon: "/images/blessedpackaging.png",
                    detail: "Packaged with Love"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#4b2e19]/10 transition-all duration-500 hover:shadow-xl hover:scale-[1.01] group">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                            <Image src={item.icon} alt={item.title} width={96} height={96} />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#4b2e19] text-white rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110">
                            {item.step}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <div className="mb-4">
                          <h3 className="text-3xl font-bold text-[#4b2e19] mb-2 transition-colors duration-300 group-hover:text-[#2f4f2f]">{item.title}</h3>
                          <span className="inline-block bg-[#f5d26a]/20 text-[#4b2e19] px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 group-hover:bg-[#f5d26a]/30">
                            {item.detail}
                          </span>
                        </div>
                        <p className="text-[#2D2D2D]/80 leading-relaxed text-lg">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Family Section */}
        {/* <section className="py-20 md:py-24 bg-gradient-to-br from-[#fdf7f2] to-[#f8f4e6]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6">Our Extended Family</h2>
              <p className="text-xl text-[#2D2D2D]/70 max-w-4xl mx-auto leading-relaxed">
                Behind every jar of ghee and every drop of honey, there are passionate individuals who have dedicated 
                their lives to preserving these ancient traditions and bringing them to your table.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    name: "Rajesh Kumar",
                    role: "Founder & Master Craftsman",
                    description: "The heart and soul of YugaFarms, Rajesh learned the art of traditional ghee making from his grandmother. With 38 years of experience, he personally oversees every batch, ensuring that the ancient bilona method is followed with the same reverence as it was centuries ago.",
                    emoji: "👨‍🌾",
                    quote: "Every drop of ghee carries the love of three generations."
                  },
                  {
                    name: "Priya Sharma",
                    role: "Quality Guardian",
                    description: "Priya brings scientific rigor to our traditional methods. As our Quality Director, she ensures that every product not only meets our high standards but exceeds them. Her laboratory is where tradition meets modern science, creating products that are both authentic and safe.",
                    emoji: "👩‍🔬",
                    quote: "Quality is not just a standard, it's our promise to your family."
                  },
                  {
                    name: "Arjun Kumar",
                    role: "Bridge to Communities",
                    description: "Arjun is our connection to the farming communities that make our work possible. He travels across India, building relationships with small family farms, ensuring fair trade practices, and helping preserve traditional farming methods for future generations.",
                    emoji: "🤝",
                    quote: "Every farmer is a partner in our mission of purity."
                  }
                ].map((person, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#4b2e19]/10 hover:shadow-2xl transition-all duration-300">
                    <div className="text-center space-y-6">
                      <div className="text-8xl">{person.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">{person.name}</h3>
                        <p className="text-[#f5d26a] font-semibold text-lg">{person.role}</p>
                      </div>
                      <p className="text-[#2D2D2D]/80 leading-relaxed text-sm">
                        {person.description}
                      </p>
                      <div className="bg-[#f5d26a]/10 rounded-2xl p-4 border-l-4 border-[#f5d26a]">
                        <p className="text-[#4b2e19] italic font-medium">
                          "{person.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

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

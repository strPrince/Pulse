import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import blogsvg from '../assets/blog-reading.svg'; 

export default function HeroSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const illustrationRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(
      titleRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1 }
    )
    .fromTo(
      subtitleRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1 },
      '-=0.5'
    )
    .fromTo(
      buttonRef.current, 
      { opacity: 0, scale: 0.5 }, 
      { opacity: 1, scale: 1, duration: 0.8 },
      '-=0.5'
    )
    .fromTo(
      illustrationRef.current,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 1 },
      '-=0.7'
    );
  }, []);

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content Section */}
          <div className="text-center lg:text-left lg:w-1/2 space-y-6">
            <h1 
              ref={titleRef} 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
            >
              Unleash Your Thoughts
            </h1>
            <p 
              ref={subtitleRef} 
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Transform your ideas into powerful narratives. Share, connect, and inspire through meaningful content.
            </p>
            <div className="pt-4">
              <button 
                ref={buttonRef}
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
              >
                Start Writing
              </button>
            </div>
          </div>
          
          {/* Image Section */}
          <div 
            ref={illustrationRef}
            className="lg:w-1/2 max-w-lg w-full"
          >
            <img
              src={blogsvg} 
              alt="Blog illustration"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
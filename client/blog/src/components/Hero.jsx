import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
    <section className="min-h-screen min-w-full flex flex-col lg:flex-row justify-center items-center bg-gradient-to-br from-gray-900 to-blue-500 bg-opacity-8  text-white py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between w-full">
        <div className="text-center lg:text-left lg:w-1/2 space-y-6">
          <h1 
            ref={titleRef} 
            className="text-5xl font-extrabold tracking-tight"
          >
            Unleash Your Thoughts
          </h1>
          <p 
            ref={subtitleRef} 
            className="text-xl text-gray-300 max-w-xl mx-auto lg:mx-0"
          >
            Transform your ideas into powerful narratives. Share, connect, and inspire through meaningful content.
          </p>
          <div>
            <button 
              ref={buttonRef}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Start Writing
            </button>
          </div>
        </div>
        
        <div 
          ref={illustrationRef}
          className="mt-12 lg:mt-0 lg:w-1/2 max-w-md"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 500 400" 
            className="w-full h-auto"
          >
            {/* Blog/Writing Illustration */}
            <rect x="50" y="50" width="400" height="300" rx="10" fill="#1E293B" />
            
            {/* Writing Desk Elements */}
            <rect x="100" y="120" width="300" height="180" fill="#2C3E50" />
            
            {/* Paper/Document */}
            <rect x="130" y="150" width="240" height="120" fill="#FFFFFF" />
            
            {/* Writing Implements */}
            <path 
              d="M380 220 L420 180 L440 200 L400 240 Z" 
              fill="#E74C3C" 
            />
            
            {/* Thought Bubbles */}
            <ellipse 
              cx="250" 
              cy="80" 
              rx="60" 
              ry="40" 
              fill="rgba(52,211,153,0.3)" 
            />
            <ellipse 
              cx="300" 
              cy="40" 
              rx="40" 
              ry="25" 
              fill="rgba(96,165,250,0.3)" 
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
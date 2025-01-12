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
              onClick={() => window.location.href = '/login'}
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
    {/* Main Blog Post Container */}
    <rect x="100" y="50" width="300" height="200" rx="8" fill="#1E293B" />
    
    {/* Blog Post Header */}
    <rect x="120" y="70" width="260" height="30" rx="4" fill="#2C3E50" />
    
    {/* Blog Content Lines */}
    <rect x="120" y="120" width="260" height="10" rx="2" fill="#4A5568" />
    <rect x="120" y="140" width="200" height="10" rx="2" fill="#4A5568" />
    <rect x="120" y="160" width="230" height="10" rx="2" fill="#4A5568" />
    
    {/* Share Icons */}
    <circle cx="150" cy="300" r="25" fill="#1DA1F2" /> {/* Twitter */}
    <circle cx="250" cy="300" r="25" fill="#4267B2" /> {/* Facebook */}
    <circle cx="350" cy="300" r="25" fill="#E4405F" /> {/* Instagram */}
    
    {/* Connection Lines */}
    <path 
      d="M150 270 L150 220 L350 220 L350 270" 
      stroke="#4A5568" 
      strokeWidth="3" 
      fill="none"
    />
    
    {/* Share Arrows */}
    <path 
      d="M145 295 L155 285 L165 295" 
      stroke="white" 
      strokeWidth="2" 
      fill="none"
    />
    <path 
      d="M245 295 L255 285 L265 295" 
      stroke="white" 
      strokeWidth="2" 
      fill="none"
    />
    <path 
      d="M345 295 L355 285 L365 295" 
      stroke="white" 
      strokeWidth="2" 
      fill="none"
    />
    
    {/* Floating Share Indicators */}
    <circle cx="420" cy="150" r="15" fill="rgba(52,211,153,0.3)" />
    <circle cx="440" cy="180" r="10" fill="rgba(96,165,250,0.3)" />
    <circle cx="400" cy="190" r="12" fill="rgba(239,68,68,0.3)" />
  </svg>
</div>

      </div>
    </section>
  );
}
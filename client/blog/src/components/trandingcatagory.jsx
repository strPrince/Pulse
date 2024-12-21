import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define website features
const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure & Private",
    description: "Your data and privacy are our top priority. We implement robust security measures to protect your information."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
      </svg>
    ),
    title: "Customizable Experience",
    description: "Tailor your reading experience with personalized recommendations and adaptive content."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Quality Content",
    description: "Curated articles from expert writers, ensuring high-quality, insightful, and engaging content."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Fast & Responsive",
    description: "Lightning-fast loading times and a smooth, responsive design across all devices."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Community-Driven",
    description: "Connect with like-minded individuals, share insights, and grow together as a community."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 01-3.86-2.104l-.323-.48a6 6 0 01-1.266-3.956V4.571A2 2 0 005.571 2h3.942c1.536 0 3.005.615 4.09 1.706l2.736 2.735" />
      </svg>
    ),
    title: "Continuous Innovation",
    description: "We're constantly improving our platform, adding new features, and staying ahead of the curve."
  }
];

export default function WebsiteFeatures() {
  const sectionRef = useRef(null);
  const featuresRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    featuresRef.current.forEach((featureEl, index) => {
      tl.fromTo(
        featureEl,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out"
        },
        index * 0.2 // Stagger effect
      );
    });
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-bl from-gray-900 to-blue-900 py-16 px-6"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl font-extrabold text-white text-center mb-12">
          Why Choose Our Platform
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={el => featuresRef.current[index] = el}
              className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 transition duration-300 hover:border-blue-600 hover:shadow-blue-900/50 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="text-blue-400 mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300 mb-6 flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {features.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-24 w-24 mx-auto mb-6 text-gray-600"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-1.414 1.414M21 12h-1M4 12H3m3.343-1.657l-1.414-1.414M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <p>No features to display</p>
          </div>
        )}
      </div>
    </section>
  );
}
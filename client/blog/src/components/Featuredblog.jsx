import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const blogsRef = useRef([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/blogs")
      .then(res => setBlogs(res.data))
      .catch(err => console.error("Error fetching blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && blogsRef.current.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      blogsRef.current.forEach((el, idx) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
          idx * 0.2
        );
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <section className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading featured blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12">
          Featured Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogs.slice(0, 6).map((blog, idx) => (
            <div
              key={blog._id}
              ref={el => blogsRef.current[idx] = el}
              className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 transition duration-300 hover:border-blue-600 hover:shadow-blue-900/50 hover:transform hover:scale-105"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-gray-300 mb-6 line-clamp-3 text-sm sm:text-base">
                {blog.content.slice(0, 150)}...
              </p>
              <a
                href={`/blog/${blog._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>

        {/* Empty state handling */}
        {blogs.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 sm:h-24 sm:w-24 mx-auto mb-6 text-gray-600"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-lg">No featured blogs available at the moment</p>
          </div>
        )}
      </div>
    </section>
  );
}
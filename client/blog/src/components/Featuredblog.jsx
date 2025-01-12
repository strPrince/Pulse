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
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/blogs");
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        // if (err.response && err.response.status === 401) {
        //   window.location.href = '/login';
        //   return;
        // }
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReadMore = (blogId) => {
    window.location.href = `/login`;
  };

  useEffect(() => {
    // Only animate if blogs are loaded and we have references
    if (!loading && blogsRef.current.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      blogsRef.current.forEach((blogEl, index) => {
        tl.fromTo(
          blogEl,
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
    }
  }, [loading]);

  if (loading) {
    return (
      <section className="container mx-auto py-8 px-6 bg-gray-900 text-white">
        <div className="text-center">Loading featured blogs...</div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen  py-16 px-6"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-5xl font-extrabold text-white text-center mb-12">
          Featured Insights
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 6).map((blog, index) => (
            <div
              key={blog._id}
              ref={el => blogsRef.current[index] = el}
              className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 transition duration-300 hover:border-blue-600 hover:shadow-blue-900/50"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {blog.title}
              </h3>
              <p className="text-gray-300 mb-6 line-clamp-3">
                {blog.content.slice(0, 150)}...
              </p>
              <a
              onClick={() => handleReadMore()}
                href={`/blog/${blog._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
              className="h-24 w-24 mx-auto mb-6 text-gray-600"
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
            <p>No featured blogs available at the moment</p>
          </div>
        )}
      </div>
    </section>
  );
}
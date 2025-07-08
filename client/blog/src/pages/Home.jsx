import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/navbar";
import Foot from "../components/footer";
import BlogPage from "./Blogspage";
import "../App.css";
import Hero from '../components/Hero';
import Fet from '../components/Featuredblog';
import Trand from '../components/trandingcatagory';
import SidebarTagsCategories from '../components/SidebarTagsCategories';

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/api/current_user", { withCredentials: true })
      .then(res => setIsAuthenticated(res.status === 200))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
        {isAuthenticated ? (
          // Authenticated user layout with sidebar
          <div className="flex justify-center items-start min-h-screen">
            {/* Sidebar for tags and categories */}
            <div className="hidden lg:block w-80 mr-8 sticky top-8 h-fit">
              <SidebarTagsCategories />
            </div>
            <div className="flex-1 max-w-4xl px-4 sm:px-6 lg:px-8">
              <BlogPage />
            </div>
          </div>
        ) : (
          // Non-authenticated user layout - full width
          <div className="w-full">
            <Hero />
            <Fet />
            <Trand />
          </div>
        )}
      </div>
      <Foot />
    </>
  );
};

export default HomePage;

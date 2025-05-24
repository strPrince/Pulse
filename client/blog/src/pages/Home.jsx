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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)' }}>
        {/* Sidebar for tags and categories */}
        <div style={{ width: 300, marginRight: 32, position: 'sticky', top: 32, height: 'fit-content', display: isAuthenticated ? 'block' : 'none' }}>
          <SidebarTagsCategories />
        </div>
        <div style={{ flex: 1, maxWidth: 900 }}>
          {isAuthenticated ? <BlogPage /> : (
            <>
              <Hero />
              <Fet />
              <Trand />
            </>
          )}
        </div>
      </div>
      <Foot />
    </>
  );
};

export default HomePage;

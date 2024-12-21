import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/navbar";
import Foot from "../components/footer";
import BlogPage from "./Blogspage";
import "../App.css";
import Hero from '../components/Hero';
import Fet from '../components/Featuredblog';
import Trand from '../components/trandingcatagory';
const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/current_user", {
          withCredentials: true, // Important to include cookies
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserData(response.data); // Save user details if needed
        }
      } catch (error) {
        console.error("User is not authenticated:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <>
      <Nav />
      <div className="" >
     
          {isAuthenticated ? (
           <BlogPage />) : (
            <>
             <Hero />
             <Fet />
             <Trand />
             </>
           )
          }
            

       </div>
      <Foot />
    </>
  );
};

export default HomePage;

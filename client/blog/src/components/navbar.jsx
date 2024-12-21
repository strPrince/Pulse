import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AndroidIcon from "@mui/icons-material/Android"; // Icon for the logo
import axios from "axios";

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  // Fetch user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/current_user",
          { withCredentials: true }
        );
        if (response.data) {
          setIsLoggedIn(true);
          setUser(response.data);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/logout"); // Adjust endpoint as per your backend
      setIsLoggedIn(false);
      setUser(null);
      navigate("/"); // Redirect to the homepage after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <Typography
        variant="h6"
        align="center"
        sx={{ marginTop: "20px", color: "#FFD700" }}
      >
        Checking authentication status...
      </Typography>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: " #090d1a" }}>
        <Toolbar>
          {/* Logo */}
       
          <Typography
            variant="h6"
            className="heading"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: 1,
             
            }}
          >
            Pulse
          </Typography>

         

          {/* Conditional Login/Signup or User Menu */}
          {!isLoggedIn ? (
            <>
             {/* Navigation Links */}
          
         
          <Button
          className="active"
            color="inherit"
            component={Link}
            to="/about"
            sx={{ fontWeight: "bold", color: "#d5eafc" }}
          >
            ABOUT US
          </Button>
          <Button
          
            color="inherit"
            component={Link}
            to="/contact"
            sx={{ fontWeight: "bold", color: "#d5eafc" }}
          >
            CONTACT US
          </Button>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ fontWeight: "bold", color: "#ef4444" }}
              >
                LOGIN
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/signup"
                sx={{ fontWeight: "bold", color: "#10b981" }}
              >
                SIGNUP
              </Button>
            </>
          ) : (
            <>
             <IconButton onClick={() => navigate("/create-post")} aria-label="create post" color="primary">
          <AddIcon />
        </IconButton>
 {/* Navigation Links */}
          
         
 <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{ fontWeight: "bold", color: "#d5eafc" }}
          >
            ABOUT US
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/contact"
            sx={{ fontWeight: "bold", color: "#d5eafc" }}
          >
            CONTACT US
          </Button>

              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar
                  alt={user?.displayName || "User"}
                  src={user?.picture || ""}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleMenuClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

    
    </>
  );
};

// Home Page
const Home = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    Welcome to My Blog!
  </Typography>
);

// Blogs Page
const Blogs = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    Blogs Page
  </Typography>
);

// About Us Page
const About = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    About Us Page
  </Typography>
);

// Contact Us Page
const Contact = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    Contact Us Page
  </Typography>
);

// Login Page
const Login = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#fbbf24" }}
  >
    Login Page
  </Typography>
);

// Signup Page
const Signup = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#fbbf24" }}
  >
    Signup Page
  </Typography>
);

export default App;

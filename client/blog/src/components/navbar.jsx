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
import AndroidIcon from "@mui/icons-material/Android";
import axios from "axios";
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const items = [
    
    {
      key: '1',
      label: 'Profile',
      extra: 'User Profile',
      onClick: () => {
        navigate("/profile");
      }
    },
    {
      key: '2',
      label: 'Logout',
      extra: 'Logout',
      onClick: () => {
        handleLogout();
      }
    },
   
  ];

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

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/logout");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
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

          {!isLoggedIn ? (
            <>
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

              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Avatar
                      alt={user?.displayName || "User"}
                      src={user?.picture || ""}
                    />
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

const Home = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    Welcome to My Blog!
  </Typography>
);

const Blogs = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    Blogs Page
  </Typography>
);

const About = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    About Us Page
  </Typography>
);

const Contact = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#22d3ee" }}
  >
    Contact Us Page
  </Typography>
);

const Login = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{ marginTop: "20px", color: "#fbbf24" }}
  >
    Login Page
  </Typography>
);

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

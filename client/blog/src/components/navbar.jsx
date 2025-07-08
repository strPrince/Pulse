import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/api/current_user", { withCredentials: true })
      .then(res => {
        setIsLoggedIn(true);
        setUser(res.data);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      })
      .finally(() => setLoading(false));
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const menuItems = [
    {
      key: '1',
      label: 'Profile',
      onClick: () => navigate("/profile")
    },
    {
      key: '2',
      label: 'Logout',
      onClick: handleLogout
    },
  ];

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: "20px", color: "#FFD700" }}>
        Checking authentication status...
      </Typography>
    );
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#181a20" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}>
          Pulse
        </Typography>
        {/* Search Bar - only for logged in users */}
        {isLoggedIn && (
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: '1px solid #333',
                outline: 'none',
                background: '#23272f',
                color: 'white',
                marginRight: 8,
                minWidth: 160
              }}
            />
            <IconButton type="submit" sx={{ color: '#aaa' }}>
              <SearchIcon />
            </IconButton>
          </form>
        )}
        {!isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/about" sx={{ fontWeight: "bold", color: "#d5eafc" }}>ABOUT US</Button>
            <Button color="inherit" component={Link} to="/contact" sx={{ fontWeight: "bold", color: "#d5eafc" }}>CONTACT US</Button>
            <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: "bold", color: "#ef4444" }}>LOGIN</Button>
            <Button color="inherit" component={Link} to="/signup" sx={{ fontWeight: "bold", color: "#10b981" }}>SIGNUP</Button>
          </>
        ) : (
          <>
            <IconButton onClick={() => navigate("/create-post")} aria-label="create post" color="primary">
              <AddIcon />
            </IconButton>
            <Button color="inherit" component={Link} to="/about" sx={{ fontWeight: "bold", color: "#d5eafc" }}>ABOUT US</Button>
            <Button color="inherit" component={Link} to="/contact" sx={{ fontWeight: "bold", color: "#d5eafc" }}>CONTACT US</Button>
            <Dropdown menu={{ items: menuItems }}>
              <a onClick={e => e.preventDefault()}>
                <Space>
                  <Avatar alt={user?.displayName || "User"} src={user?.picture || ""} />
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

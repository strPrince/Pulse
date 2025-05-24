import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Stack, Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SidebarTagsCategories = () => {
  const [tags, setTags] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and tags from custom API endpoints
       
         
         const  tagRes = await axios.get("http://localhost:3000/api/tags")
        
       
        console.log([tagRes.data]);
        
        setTags(tagRes.data || []);
      } catch (err) {
        
        setTags([]);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (cat) => {
    navigate(`/categories/${cat}`);
  };
  const handleTagClick = (tag) => {
    navigate(`/tags/${tag}`);
  };

  return (
    <Paper elevation={12} sx={{ p: 3, background: '#181828', borderRadius: 4, color: '#e6e6ff', minWidth: 250 , Height: 300}}>
      
      <Typography variant="h6" fontWeight="bold" color="#4a90e2" mb={2}>
        Tags
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {tags.length === 0 && <Typography variant="body2" color="gray">No tags</Typography>}
        {tags.map((tag, idx) => (
          <Chip
            key={idx}
            label={tag}
            onClick={() => handleTagClick(tag)}
            sx={{
              backgroundColor: 'rgba(74,144,226,0.15)',
              color: '#4a90e2',
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'rgba(74,144,226,0.3)' }
            }}
            clickable
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default SidebarTagsCategories;

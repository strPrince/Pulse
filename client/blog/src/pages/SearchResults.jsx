import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CircularProgress } from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const q = query.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/search?q=${encodeURIComponent(q)}`)
      .then((res) => {
        setResults(res.data);
        setError("");
      })
      .catch((err) => {
        setError("Error fetching search results");
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #0f0f1a, #1a1a2e)", py: 6 }}>
      <Box sx={{ maxWidth: 900, mx: "auto", px: 2 }}>
        <Typography variant="h4" sx={{ color: "#4a90e2", mb: 4, fontWeight: 700, letterSpacing: 1 }}>
          Search Results for <span style={{ color: '#fff' }}>&quot;{q}&quot;</span>
        </Typography>
        {loading && <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress sx={{ color: "#4a90e2" }} /></Box>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && results.length === 0 && (
          <Typography color="white">No results found.</Typography>
        )}
        <Box mt={4} display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
          {results.map((blog) => (
            <Card
              key={blog._id}
              sx={{
                p: 3,
                backgroundColor: "#232B39",
                color: "white",
                borderRadius: 3,
                boxShadow: '0 4px 24px 0 rgba(74,144,226,0.10)',
                transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.03)',
                  boxShadow: '0 8px 32px 0 rgba(74,144,226,0.18)',
                  background: 'linear-gradient(120deg, #232B39 80%, #2d3a5a 100%)',
                  borderColor: '#4a90e2',
                },
                textDecoration: 'none',
                cursor: 'pointer',
                minHeight: 180
              }}
              component={Link}
              to={`/blog/${blog._id}`}
            >
              <Box display="flex" alignItems="center" mb={1} gap={1}>
                <img
                  src={blog.authorAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(blog.author)}
                  alt={blog.author}
                  style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8, border: '2px solid #4a90e2', background: '#181828' }}
                  loading="lazy"
                />
                <Typography variant="body2" sx={{ color: "#aaa", fontWeight: 500 }}>
                  {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: "#4a90e2", fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                {blog.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff", mb: 1, fontSize: 15, lineHeight: 1.6 }}>
                {blog.content.slice(0, 140)}{blog.content.length > 140 ? "..." : ""}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {blog.tags?.map((tag) => (
                  <span key={tag} style={{ color: "#4a90e2", background: "rgba(74,144,226,0.15)", borderRadius: 8, padding: "2px 10px", fontSize: 13, marginRight: 6, fontWeight: 600, letterSpacing: 0.5 }}>
                    #{tag}
                  </span>
                ))}
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResults;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditBlog() {
  const { id } = useParams(); // Get blog ID from route
  const navigate = useNavigate(); // To navigate back if needed
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const styles = {
    darkContainer: {
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff',
    },
    blogEditor: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#2d2d2d',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    editInput: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      backgroundColor: '#3d3d3d',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '18px',
    },
    editTextarea: {
      width: '100%',
      minHeight: '200px',
      padding: '10px',
      marginBottom: '15px',
      backgroundColor: '#3d3d3d',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '16px',
      resize: 'vertical',
    },
    editorButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    saveButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#f44336',
      color: 'white',
    },
    editButton: {
      backgroundColor: '#2196F3',
      color: 'white',
    },
    title: {
      marginBottom: '20px',
      color: '#fff',
    },
    content: {
      lineHeight: '1.6',
      color: '#ddd',
    },
  };

  // Fetch blog data by ID
  useEffect(() => {
    async function loadBlog() {
      try {
        const response = await axios.get(`http://localhost:3000/api/blogs/${id}`);
        const blog = response.data;
        setTitle(blog.title);
        setContent(blog.content);
      } catch (error) {
        console.error('Error fetching blog:', error);
        alert('Failed to load blog data.');
      }
    }
    loadBlog();
  }, [id]);

  // Handle save functionality
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/api/blogs/${id}`, { title, content });
      setIsEditing(false);
      navigate('/'); // Redirect after saving
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save changes.');
    }
  };

  // Handle cancel functionality
  const handleCancel = () => {
    setIsEditing(false);
    navigate('/'); // Redirect without saving
  };

  return (
    <div style={styles.darkContainer}>
      <div style={styles.blogEditor}>
        {isEditing ? (
          <>
            <h1 style={styles.title}>Edit Blog</h1>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.editInput}
            />
            <label htmlFor="content">Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.editTextarea}
            />
            <div style={styles.editorButtons}>
              <button 
                onClick={handleSave} 
                style={{...styles.button, ...styles.saveButton}}
              >
                Save
              </button>
              <button 
                onClick={handleCancel} 
                style={{...styles.button, ...styles.cancelButton}}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.content}>{content}</p>
            <button 
              onClick={() => setIsEditing(true)} 
              style={{...styles.button, ...styles.editButton}}
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EditBlog;

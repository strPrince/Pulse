import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import axios from 'axios';
import Nav from '../components/navbar';
import Foot from '../components/footer';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch blog data by ID
  useEffect(() => {
    async function loadBlog() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/blogs/${id}`);
        const blog = response.data;
        setTitle(blog.title);
        setContent(blog.content);
        setOriginalTitle(blog.title);
        setOriginalContent(blog.content);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setSnackbarMessage('Failed to load blog data.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlog();
  }, [id]);

  // Handle save functionality
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbarMessage('Please fill in both title and content.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      setIsSaving(true);
      await axios.put(`http://localhost:3000/api/blogs/${id}`, { title, content });
      setOriginalTitle(title);
      setOriginalContent(content);
      setIsEditing(false);
      setSnackbarMessage('Blog updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving blog:', error);
      setSnackbarMessage('Failed to save changes.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel functionality
  const handleCancel = () => {
    setTitle(originalTitle);
    setContent(originalContent);
    setIsEditing(false);
    setPreviewMode(false);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = title !== originalTitle || content !== originalContent;

  const handleBackClick = () => {
    if (hasUnsavedChanges && isEditing) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        // Auto-save to localStorage
        localStorage.setItem(`blog-draft-${id}`, JSON.stringify({
          title,
          content,
          timestamp: new Date().toISOString()
        }));
      }, 2000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [title, content, isEditing, hasUnsavedChanges, id]);

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`blog-draft-${id}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const draftTime = new Date(draft.timestamp);
        const now = new Date();
        const diffMinutes = (now - draftTime) / (1000 * 60);
        
        // Show draft if it's less than 30 minutes old
        if (diffMinutes < 30) {
          const useDraft = window.confirm(
            `A draft from ${draftTime.toLocaleString()} was found. Would you like to restore it?`
          );
          if (useDraft) {
            setTitle(draft.title);
            setContent(draft.content);
            setIsEditing(true);
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [id]);

  // Clear draft when successfully saved
  const clearDraft = () => {
    localStorage.removeItem(`blog-draft-${id}`);
  };

  // Updated save function with draft clearing
  const handleSaveWithDraftClear = async () => {
    await handleSave();
    clearDraft();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            if (isEditing) {
              handleSaveWithDraftClear();
            }
            break;
          case 'e':
            e.preventDefault();
            if (!isEditing) {
              setIsEditing(true);
            }
            break;
          case 'Escape':
            if (isEditing) {
              handleCancel();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  if (isLoading) {
    return (
      <>
        <Nav />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ color: '#4a90e2' }} size={60} />
        </Box>
        <Foot />
      </>
    );
  }
  return (
    <>
      <Nav />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)',
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Tooltip title="Back to Home">
                <IconButton
                  onClick={handleBackClick}
                  sx={{
                    color: '#4a90e2',
                    '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  flexGrow: 1,
                }}
              >
                {isEditing ? 'Edit Blog Post' : 'Blog Post'}
              </Typography>
              {hasUnsavedChanges && isEditing && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ffa726',
                    fontStyle: 'italic',
                  }}
                >
                  Unsaved changes
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Main Content */}
          <Paper
            elevation={8}
            sx={{
              background: 'linear-gradient(145deg, #1e1e1e, #292929)',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {isEditing ? (
              <Box sx={{ p: 4 }}>
                {/* Edit Mode */}
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#3d3d3d',
                        color: '#fff',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#4a90e2' },
                        '&.Mui-focused fieldset': { borderColor: '#4a90e2' },
                      },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4a90e2' },
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Blog Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    multiline
                    rows={15}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#3d3d3d',
                        color: '#fff',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: '#4a90e2' },
                        '&.Mui-focused fieldset': { borderColor: '#4a90e2' },
                      },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4a90e2' },
                    }}
                  />

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      onClick={() => setPreviewMode(!previewMode)}
                      startIcon={<PreviewIcon />}
                      variant="outlined"
                      sx={{
                        color: '#4a90e2',
                        borderColor: '#4a90e2',
                        '&:hover': {
                          backgroundColor: 'rgba(74, 144, 226, 0.1)',
                          borderColor: '#4a90e2',
                        },
                      }}
                    >
                      {previewMode ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      sx={{
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          borderColor: '#f44336',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveWithDraftClear}
                      startIcon={<SaveIcon />}
                      variant="contained"
                      disabled={isSaving || !title.trim() || !content.trim()}
                      sx={{
                        backgroundColor: '#4CAF50',
                        '&:hover': { backgroundColor: '#45a049' },
                        '&:disabled': { backgroundColor: '#666' },
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Stack>

                  {/* Keyboard shortcuts help */}
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(74, 144, 226, 0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#4a90e2', mb: 1, fontWeight: 'bold' }}>
                      Keyboard Shortcuts:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.875rem' }}>
                      • Ctrl/Cmd + S: Save changes
                      • Ctrl/Cmd + E: Enter edit mode
                      • Escape: Cancel editing
                    </Typography>
                  </Box>
                </Stack>

                {/* Preview Section */}
                {previewMode && (
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                    <Typography variant="h6" sx={{ color: '#4a90e2', mb: 2 }}>
                      Preview
                    </Typography>
                    <Card
                      sx={{
                        background: 'linear-gradient(145deg, #2d2d2d, #3d3d3d)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h4"
                          sx={{
                            color: '#fff',
                            fontWeight: 'bold',
                            mb: 2,
                            wordBreak: 'break-word',
                          }}
                        >
                          {title || 'Untitled'}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#ddd',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {content || 'No content'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ p: 4 }}>
                {/* View Mode */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      flex: 1,
                      wordBreak: 'break-word',
                    }}
                  >
                    {title}
                  </Typography>
                  <Button
                    onClick={() => setIsEditing(true)}
                    startIcon={<EditIcon />}
                    variant="contained"
                    sx={{
                      backgroundColor: '#4a90e2',
                      '&:hover': { backgroundColor: '#357abd' },
                      ml: 2,
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
                
                <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#ddd',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {content}
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSaving}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Saving changes...
          </Typography>
        </Box>
      </Backdrop>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Foot />
    </>
  );
}

export default EditBlog;

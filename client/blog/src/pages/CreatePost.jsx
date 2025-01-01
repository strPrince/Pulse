import React, { useState , useEffect} from 'react';
import {
  Container,
  Box,
  Paper,
  Avatar,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import LinkIcon from '@mui/icons-material/Link';
import PreviewIcon from '@mui/icons-material/Preview';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const BlogPostPage = () => {
  // User state
  const [user, setUser] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Rich text editor states
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Rich text formatting handlers
  const handleFormat = (format) => {
    const textArea = document.querySelector('textarea');
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    setSelection({ start, end });
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/current_user', { withCredentials: true });
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setSnackbarMessage('Failed to load user data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchUser();
  }, []);

  // const handlePost = async () => {
  //   try {
  //     if (!title.trim() || !content.trim()) {
  //       setSnackbarMessage('Both title and content are required!');
  //       setSnackbarSeverity('warning');
  //       setSnackbarOpen(true);
  //       return;
  //     }

  //     setIsSubmitting(true);
  
  //     const blogPost = {
  //       title: title.trim(),
  //       content: content.trim(),
  //       tags: catagory.trim(),
  //       author: user?.username || 'Anonymous',
  //     };
  
  //     const response = await axios.post(
  //       'http://localhost:3000/api/blog-posts',
  //       blogPost,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  
  //     setSnackbarMessage('Post saved successfully!');
  //     setSnackbarSeverity('success');
  //     setSnackbarOpen(true);
  //     setTitle('');
  //     setContent('');
  //     setCategory('');
  //   } catch (error) {
  //     console.error('Error creating blog post:', error);
  //     setSnackbarMessage('Failed to create blog post');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleLinkClick = () => {
    const textArea = document.querySelector('textarea');
    setSelection({
      start: textArea.selectionStart,
      end: textArea.selectionEnd
    });
    setShowLinkDialog(true);
  };

  const handleAddLink = () => {
    const selectedText = content.substring(selection.start, selection.end);
    const linkMD = `[${selectedText}](${linkUrl})`;
    const newContent = 
      content.substring(0, selection.start) + 
      linkMD + 
      content.substring(selection.end);
    
    setContent(newContent);
    setShowLinkDialog(false);
    setLinkUrl('');
  };

  // Post submission handler
  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:3000/api/blog-posts', {
        title: title.trim(),
        content: content.trim(),
        category: category.split(',').map(cat => cat.trim()).filter(cat => cat),
        author: user?.username || 'Anonymous'
      }, {
        withCredentials: true
      });

      setSnackbarMessage('Post published successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Clear form
      setTitle('');
      setContent('');
      setCategory('');
      setShowPreview(false);
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to publish post');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mainc" style={{ backgroundColor: '#121212' }}>
      <Container maxWidth="lg" sx={{ bgcolor: '#121212' }}>
        <Box
          sx={{
            minHeight: '100vh',
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            bgcolor: '#121212',
            color: '#fff'
          }}
        >
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: '#1E1E1E',
              color: '#fff'
            }}
          >
            <Avatar
              alt={user?.username || 'User'}
              src={user?.picture || 'https://via.placeholder.com/100'}
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="h5" fontWeight="medium" color="#fff">
                {user?.username || 'Guest User'}
              </Typography>
              <Typography variant="body2" color="#9BA4B5">
                Share your thoughts with the community
              </Typography>
            </Box>
          </Paper>

          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              bgcolor: '#1E1E1E',
              color: '#fff'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium" color="#fff">
                Create a New Blog Post
              </Typography>
              
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#394867',
                      },
                      '&:hover fieldset': {
                        borderColor: '#537FE7',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#9BA4B5'
                    }
                  }}
                  required
                  error={title.trim() === ''}
                  helperText={title.trim() === '' ? 'Title is required' : ''}
                />
                
                <Box sx={{ width: '100%', mb: 3 }}>
                  <Box sx={{ mb: 1, backgroundColor: '#1C232D', p: 1, borderRadius: '4px' }}>
                    <ToggleButtonGroup
                      size="small"
                      sx={{
                        '& .MuiToggleButton-root': {
                          color: '#9BA4B5',
                          borderColor: '#394867',
                          '&:hover': {
                            backgroundColor: 'rgba(83, 127, 231, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(83, 127, 231, 0.2)',
                            color: '#537FE7',
                          },
                        },
                      }}
                    >
                      <Tooltip title="Bold">
                        <ToggleButton value="bold" onClick={() => handleFormat('bold')}>
                          <FormatBoldIcon />
                        </ToggleButton>
                      </Tooltip>
                      <Tooltip title="Italic">
                        <ToggleButton value="italic" onClick={() => handleFormat('italic')}>
                          <FormatItalicIcon />
                        </ToggleButton>
                      </Tooltip>
                      <Tooltip title="Add Link">
                        <ToggleButton value="link" onClick={handleLinkClick}>
                          <LinkIcon />
                        </ToggleButton>
                      </Tooltip>
                      <Tooltip title="Preview">
                        <ToggleButton 
                          value="preview"
                          selected={showPreview}
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          <PreviewIcon />
                        </ToggleButton>
                      </Tooltip>
                    </ToggleButtonGroup>
                  </Box>

                  {showPreview ? (
                    <Box 
                      sx={{ 
                        p: 2, 
                        minHeight: '300px',
                        backgroundColor: '#1C232D',
                        color: '#fff',
                        borderRadius: '4px',
                        border: '1px solid #394867',
                        '& a': {
                          color: '#537FE7',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        },
                      }}
                    >
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </Box>
                  ) : (
                    <TextField
                      label="Content"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#394867',
                          },
                          '&:hover fieldset': {
                            borderColor: '#537FE7',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#9BA4B5'
                        }
                      }}
                      required
                      error={content.trim() === ''}
                      helperText={content.trim() === '' ? 'Content is required' : ''}
                    />
                  )}
                </Box>
                
                <TextField
                  label="Category"
                  variant="outlined"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#394867',
                      },
                      '&:hover fieldset': {
                        borderColor: '#537FE7',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#9BA4B5'
                    }
                  }}
                  placeholder="Enter category tags separated by commas"
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePost}
                  fullWidth
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    bgcolor: '#537FE7',
                    '&:hover': {
                      bgcolor: '#3457D5'
                    }
                  }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Dialog 
          open={showLinkDialog} 
          onClose={() => setShowLinkDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#1C232D',
              color: '#fff',
            }
          }}
        >
          <DialogTitle>Add Link</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="URL"
              type="url"
              fullWidth
              variant="outlined"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#394867',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#9BA4B5'
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowLinkDialog(false)} sx={{ color: '#9BA4B5' }}>
              Cancel
            </Button>
            <Button onClick={handleAddLink} sx={{ color: '#537FE7' }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default BlogPostPage;
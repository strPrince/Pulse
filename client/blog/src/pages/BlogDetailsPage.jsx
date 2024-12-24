import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowUp, FaArrowDown, FaBookmark, FaShare, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const API_BASE_URL = "http://localhost:3000/api";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [voteScore, setVoteScore] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const fetchBlogData = useCallback(async () => {
    try {
      const [blogResponse, voteResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/blogs/${id}`),
        axios.get(`${API_BASE_URL}/blogs/${id}/vote-status`, {
          withCredentials: true
        })
      ]);

      setBlog(blogResponse.data);
      setVoteScore(blogResponse.data.voteScore || 0);
      setUserVote(voteResponse.data.voteStatus);
    } catch (err) {
      setError("Error fetching blog data");
      console.error("Error fetching blog data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/${id}`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Error loading comments");
    }
  }, [id]);

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [fetchBlogData, fetchComments]);

  const handleVote = async (direction) => {
    try {
      const action = userVote === direction ? 'remove' : direction;
      
      const response = await axios.post(
        `${API_BASE_URL}/blogs/${id}/vote`,
        { action },
        { withCredentials: true }
      );

      setVoteScore(response.data.voteScore);
      setUserVote(response.data.userVote);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please log in to vote");
      } else {
        console.error("Error voting:", err);
        alert("Error submitting vote");
      }
    }
  };

  const shareableLink = `http://localhost:5173/blog/${blog?._id}`;
  
  const handleShare = async (platform) => {
    const encodedLink = encodeURIComponent(shareableLink);
    const encodedTitle = encodeURIComponent(blog?.title || '');
    
    let shareUrl;
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareableLink);
          alert('Link copied to clipboard!');
          return;
        } catch (err) {
          console.error('Failed to copy link:', err);
          alert('Failed to copy link');
          return;
        }
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const ShareMenu = () => (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full"
        >
          <FaTwitter className="mr-3" /> Twitter
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full"
        >
          <FaFacebook className="mr-3" /> Facebook
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full"
        >
          <FaLinkedin className="mr-3" /> LinkedIn
        </button>
        <button
          onClick={() => handleShare('copy')}
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full"
        >
          <FaShare className="mr-3" /> Copy Link
        </button>
      </div>
    </div>
  );
  
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Add loading state while submitting
      setIsLoading(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/comments/${id}`,
        { 
          content: newComment,
          blogId: id // Ensure blogId is included
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setComments((prevComments) => [response.data, ...prevComments]);
        setNewComment('');
      } else {
        throw new Error('No data received from server');
      }

    } catch (err) {
      console.error('Error posting comment:', err);
      alert(err.response?.data?.message || "Error posting comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!blog) return <p className="text-white text-center">Blog not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="blog-card flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
          <div className="flex flex-col items-center mr-6 pt-2">
            <button 
              onClick={() => handleVote("up")}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${userVote === 'up' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <FaArrowUp className="text-2xl text-white" />
            </button>
            <span className="my-3 font-bold text-lg">{voteScore}</span>
            <button 
              onClick={() => handleVote("down")}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${userVote === 'down' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
            >
              <FaArrowDown className="text-2xl text-white" />
            </button>
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <div>
                  <span className="mr-3">Posted by {blog.author}</span>
                  <span>{new Date(blog.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex gap-3 relative">
                  <button className="hover:text-blue-400 transition-colors">
                    <FaBookmark className="text-lg" />
                  </button>
                  <button 
                    className="hover:text-blue-400 transition-colors"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                  >
                    <FaShare className="text-lg" />
                  </button>
                  {showShareMenu && <ShareMenu />}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">{blog.title}</h1>
              <div className="flex gap-2 mb-4">
                {blog.tags?.map((tag, index) => (
                  <span key={index} className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="mb-8">
                {blog.image && (
                  <img 
                    src={blog.image} 
                    alt="Blog cover" 
                    className="w-full rounded-xl mb-6 object-cover shadow-lg"
                    loading="lazy"
                  />
                )}
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {blog.content}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitComment} className="mt-8">
              <textarea
                value={newComment}
                onChange={handleCommentChange}
                className="w-full p-4 bg-gray-800/50 text-white border border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a comment..."
                rows="4"
                required
              />
              <button 
                type="submit"
                className="mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newComment.trim()}
              >
                Post Comment
              </button>
            </form>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">
                Comments ({comments.length})
              </h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white font-medium">@{comment.author}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-lg">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;

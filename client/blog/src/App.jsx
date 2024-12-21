import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import BlogDetailsPage from "./pages/BlogDetailsPage";
import Profile from './pages/Profile.jsx';
import CreatePost from './pages/CreatePost.jsx';
import BlogPage from './pages/Blogspage.jsx';
import PublicProfile from './pages/userpublicprofile.jsx';
import AboutUsPage from './pages/Aboutus.jsx';import ContactUs from './pages/conus.jsx';
function App() {
  

  return (
    <>
   
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/user/:username" element={<PublicProfile />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>  

    </>
  )
  
}

export default App

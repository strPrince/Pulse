# Pulse - A User Blog Sharing Platform

#### Welcome to Pulse, a vibrant blogging platform where users can express their thoughts, share images, and connect with others through blogs, comments, and upvotes/downvotes. With additional features like user profiles, group chats, and a robust follow system in the pipeline, Pulse is your space for meaningful engagement.



## Features
- User Authentication:
- Login and registration with secure sessions.
- User Profile:
- Set and update username, bio, and profile details.
- Blog Creation:
- Write and publish blogs with text and image support.
- Community Interaction:
- Upvote and downvote blogs.
- Comment on posts to spark conversations.
- Share blogs with others.
- Upcoming Features:
- Follow other users.
- Create and join group chats.
- Personalized feed based on followed users and topics.
- Search Functionality:
- Full-text search for blogs by title, content, and tags.
- Instant view of results from the navigation bar.

## Tech Stack
**Frontend**:\
***React***: For building a dynamic and responsive user interface.\

***MUI (Material-UI)***: For a modern and accessible design system.\

**Backend**

***Node.js & Express.js:*** To create robust server-side APIs and manage application logic.\
***Express-Session:*** For secure and efficient session management.

**Database**

***MongoDB:*** To store and manage user data, blogs, comments, and votes.

**Other Tools and Libraries**

***Cloudinary***: For image uploads and storage.\
Socket.io: For real-time group chat (planned feature).




## Contact
For questions or suggestions, please reach out:

Email: chaniyaraprince1@gmail.com\
GitHub: strPrince

Let me know if you'd like to expand on any part or include more details! 🚀

---

# Pulse Blog Platform - Search Functionality

## 🔍 Search Feature Overview
Pulse now supports full-text search for blogs by title, content, and tags. Users can search from the navigation bar and view results instantly.

---

## 🚀 How It Works

### 1. **Frontend**
- **Search Bar**: Added to the navbar for quick access.
- **Search Results Page**: Displays matching blogs with title, snippet, author, and tags.
- **Routing**: Navigates to `/search?q=your+query` and fetches results from the backend.

### 2. **Backend**
- **Endpoint**: `GET /api/search?q=your+query`
- **Logic**: Searches blogs by title, content, or tags (case-insensitive, partial match).
- **Returns**: Array of matching blog objects.

---

## 🛠️ Implementation Details

### Backend (`server/routes/searchRoutes.js`)
```js
// GET /api/search?q=your+query
router.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }
  try {
    const regex = new RegExp(q, 'i');
    const blogs = await Blog.find({
      $or: [
        { title: regex },
        { content: regex },
        { tags: regex }
      ]
    }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search blogs' });
  }
});
```
- **Registration**: Registered in `server.js` as `app.use(searchRoutes);`

### Frontend
- **Navbar**: Search input and button, submits to `/search?q=...`.
- **`SearchResults.jsx`**: Fetches and displays results from `/api/search`.
- **Routing**: Route added in `App.jsx` for `/search`.

---

## 📝 Usage
1. Type your query in the search bar (top navigation).
2. Press Enter or click the search icon.
3. View results on the Search Results page.

---

## 📂 File Changes
- `server/routes/searchRoutes.js` (new)
- `server/server.js` (register route)
- `client/blog/src/components/navbar.jsx` (search bar UI)
- `client/blog/src/pages/SearchResults.jsx` (results page)
- `client/blog/src/App.jsx` (route)

---

## 💡 Notes
- Search is case-insensitive and matches partial words.
- Results are sorted by newest first.
- You can search by title, content, or tags.

---

## 🧑‍💻 Example
- Searching for `react` will return all blogs with `react` in the title, content, or tags.

---

## ❓ Questions?
Open an issue or contact the maintainer for help.

## 🚀 Next Steps
- Add more advanced search options (e.g., author, date range, etc.).
- Implement pagination for large result sets.
- Enhance the UI for a better user experience.
-notify
-dynamic title 
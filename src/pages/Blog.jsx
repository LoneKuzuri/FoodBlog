// src/Blog.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import client from './contentful'; // adjust path

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
  client.getEntries({ content_type: 'blogPost' })
    .then((res) => {
      console.log("Fetched Blogs:", res); // ✅ Log the response
      setBlogs(res.items);
    })
    .catch(console.error);
}, []);


  return (
    <div className="blog-list">
      <h1>Our Latest Blog Posts</h1>
      <div className="blogs">
        {blogs.map((blog) => (
          <article key={blog.sys.id} className="blog-card">
            <img
              src={blog.fields.image?.fields?.file?.url}
              alt={blog.fields.title}
              className="blog-img"
            />
            <div className="blog-body">
              <h2>{blog.fields.title}</h2>
              <p>{blog.fields.description || 'No description Available'}</p>
            </div>
            <Link to={`/blog/${blog.sys.id}`} className="read-more">
              Full Recipe
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;

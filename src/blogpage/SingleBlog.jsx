// src/SingleBlog.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SingleBlog.css';
import client from './contentful';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [isSlidingOut, setIsSlidingOut] = useState(false); // fade-out control

  useEffect(() => {
    client.getEntry(id)
      .then((res) => setBlog(res))
      .catch(console.error);
  }, [id]);

  const handleBackClick = () => {
    setIsSlidingOut(true); // start fade-out
    setTimeout(() => {
      navigate('/blog');
    }, 300); 
  };

  if (!blog) {
    return (
      <div className="not-found">
        <span className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
      </div>
    );
  }

  return (
    <div className={`single-blog ${isSlidingOut ? 'slide-out' : ''}`}>
      <button onClick={handleBackClick} className="back-link">← Back to Blog</button>

      <img
        src={blog.fields.image?.fields?.file?.url}
        alt={blog.fields.title}
        className="blog-detail-img"
      />
      <h1>{blog.fields.title}</h1>

      <div className="meta">
        <span className="author">{blog.fields.author || 'Admin'}</span> ·{' '}
        <span className="date">{blog.fields.date || 'Unknown date'}</span>
      </div>

      <pre className="content">{blog.fields.content}</pre>
    </div>
  );
};

export default SingleBlog;

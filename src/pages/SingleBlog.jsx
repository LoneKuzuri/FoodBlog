// src/SingleBlog.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SingleBlog.css';
import client from './contentful';

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    client.getEntry(id)
      .then((res) => setBlog(res))
      .catch(console.error);
  }, [id]);

  if (!blog) return <div className="not-found">Loading blog...</div>;

  return (
    <div className="single-blog">
      <Link to="/blog" className="back-link">← Back to Blog</Link>

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

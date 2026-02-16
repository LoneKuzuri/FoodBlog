import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SingleBlog.css';
import client from './contentful';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSlidingOut, setIsSlidingOut] = useState(false); // fade-out control

  useEffect(() => {
    const fetchSingle = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await client.getEntry(id);
        setBlog(res);

      } catch (err) {
        console.error('Error fetching single blog:', err);
        setError('Failed to load this blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchSingle();
  }, [id]);

  const handleBackToBlog = () => {
    setIsSlidingOut(true);
    setTimeout(() => {
      navigate('/blog');
    }, 300);
  };

  const imageUrl = blog?.fields?.image?.fields?.file?.url
    ? (blog.fields.image.fields.file.url.startsWith('http')
        ? blog.fields.image.fields.file.url
        : `https:${blog.fields.image.fields.file.url}`)
    : null;

  // Loading state
  if (loading) {
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

  // Error state
  if (error) {
    return (
      <div className="single-blog error-state">
        <div className="top-actions">
          <Link to="/" className="back-link">← Back to Home</Link>
          <button onClick={() => navigate('/blog')} className="back-link secondary">
            ← Back to Blog
          </button>
        </div>

        <h1>Oops!</h1>
        <p>{error}</p>

        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  // Not found
  if (!blog) {
    return (
      <div className="single-blog error-state">
        <div className="top-actions">
          <Link to="/" className="back-link">← Back to Home</Link>
          <button onClick={() => navigate('/blog')} className="back-link secondary">
            ← Back to Blog
          </button>
        </div>

        <h1>Blog not found</h1>
        <p>This post may have been removed or the link is invalid.</p>
      </div>
    );
  }

  // content safe display
  const contentValue =
    typeof blog.fields.content === 'string'
      ? blog.fields.content
      : JSON.stringify(blog.fields.content, null, 2); // fallback if RichText object

  return (
    <div className={`single-blog ${isSlidingOut ? 'slide-out' : ''}`}>
      {/* ✅ Top navigation buttons */}
      <div className="top-actions">
        <Link to="/" className="back-link">← Back to Home</Link>

        <button onClick={handleBackToBlog} className="back-link secondary">
          ← Back to Blog
        </button>
      </div>

      {/* ✅ Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={blog.fields.title || "Blog image"}
          className="blog-detail-img"
          loading="lazy"
        />
      ) : (
        <div className="blog-detail-img fallback-img">No Image</div>
      )}

      <h1>{blog.fields.title}</h1>

      <div className="meta">
        <span className="author">{blog.fields.author || 'Admin'}</span> ·{' '}
        <span className="date">{blog.fields.date || 'Unknown date'}</span>
      </div>

      {/* ✅ Content */}
      <pre className="content">{contentValue}</pre>
    </div>
  );
};

export default SingleBlog;

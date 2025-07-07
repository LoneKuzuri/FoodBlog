
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import client from './contentful'; 

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSlidingIn, setIsSlidingIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await client.getEntries({ 
          content_type: 'blogPost',
          order: '-sys.createdAt', // Most recent first
          limit: 12 // Limit for better performance
        });
        
        console.log("Fetched Blogs:", res);
        setBlogs(res.items);
        
        // Small delay to show loading state briefly
        setTimeout(() => {
          setIsSlidingIn(true);
          setLoading(false);
        }, 300);
        
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="blog-list">
      <h1>Our Latest Blog Posts</h1>
      <div className="blogs">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="blog-card skeleton-card">
            <div className="skeleton-img"></div>
            <div className="blog-body">
              <div className="skeleton-title"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-description short"></div>
            </div>
            <div className="skeleton-button"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="blog-list error-state">
        <h1>Oops! Something went wrong</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={`blog-list ${isSlidingIn ? 'slide-in-blog' : ''}`}>
      <h1>Our Latest Blog Posts</h1>
      <div className="blogs">
        {blogs.map((blog, index) => {
          console.log("Single Blog Data:", blog);
          return (
            <article 
              key={blog.sys.id} 
              className="blog-card"
              style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
            >
              <img
                src={blog.fields.image?.fields?.file?.url}
                alt={blog.fields.title}
                className="blog-img"
                loading="lazy" // Lazy load images
              />
              <div className="blog-body">
                <h2>{blog.fields.title}</h2>
                <p>{blog.fields.description || 'No description available'}</p>
              </div>
              <Link to={`/blog/${blog.sys.id}`} className="read-more">
                Full Recipe →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
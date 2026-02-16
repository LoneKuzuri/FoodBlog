import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import client from './contentful';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSlidingIn, setIsSlidingIn] = useState(false);
  const [error, setError] = useState(null);

  // UI states
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest'); // newest | oldest
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await client.getEntries({
          content_type: 'blogPost',
          order: '-sys.createdAt',
          limit: 60
        });

        setBlogs(res.items || []);

        setTimeout(() => {
          setIsSlidingIn(true);
          setLoading(false);
        }, 220);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getImageUrl = (blog) => {
    const url = blog?.fields?.image?.fields?.file?.url;
    if (!url) return null;
    return url.startsWith('http') ? url : `https:${url}`;
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...blogs];

    list.sort((a, b) => {
      const da = new Date(a.sys?.createdAt || 0).getTime();
      const db = new Date(b.sys?.createdAt || 0).getTime();
      return sort === 'newest' ? db - da : da - db;
    });

    if (term) {
      list = list.filter((b) => {
        const title = (b.fields?.title || '').toLowerCase();
        const desc = (b.fields?.description || '').toLowerCase();
        return title.includes(term) || desc.includes(term);
      });
    }

    return list;
  }, [blogs, search, sort]);

  const shown = filtered.slice(0, visibleCount);

  const LoadingSkeleton = () => (
    <div className="blog-page">
      <div className="blog-shell">
        <div className="blog-topbar">
          <Link to="/" className="blog-back">← Back to Home</Link>
          <div className="blog-topbar-right">
            <div className="blog-search">
              <input placeholder="Search posts..." disabled />
              <button className="blog-icon-btn" disabled>🔎</button>
            </div>
            <div className="blog-select-wrap">
              <select className="blog-select" disabled>
                <option>Newest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="blog-hero">
          <div className="blog-hero-left">
            <h1>Discover tasty ideas</h1>
            <p>Recipes, tips, and quick inspiration — curated for you.</p>
            <div className="blog-mini">
              <span className="pill">🔥 Trending</span>
              <span className="pill">🍲 Recipes</span>
              <span className="pill">⚡ Quick Tips</span>
            </div>
          </div>

          <div className="blog-hero-card">
            <div className="hero-stat">
              <span className="hero-stat-num">12+</span>
              <span className="hero-stat-label">New Posts</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">4.8⭐</span>
              <span className="hero-stat-label">Community</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">5 min</span>
              <span className="hero-stat-label">Avg Read</span>
            </div>
          </div>
        </div>

        <div className="blog-grid">
          {[...Array(9)].map((_, idx) => (
            <div key={idx} className="blog-card skeleton-card">
              <div className="skeleton-img"></div>
              <div className="blog-card-body">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-description short"></div>
              </div>
              <div className="skeleton-button"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="blog-page">
        <div className="blog-shell">
          <div className="blog-topbar">
            <Link to="/" className="blog-back">← Back to Home</Link>
          </div>

          <div className="blog-empty">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="blog-primary-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;

  return (
    <div className={`blog-page ${isSlidingIn ? 'slide-in' : ''}`}>
      <div className="blog-shell">
        {/* Topbar */}
        <div className="blog-topbar">
          <Link to="/" className="blog-back">← Back to Home</Link>

          <div className="blog-topbar-right">
            <div className="blog-search">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(9);
                }}
                placeholder="Search posts..."
                aria-label="Search blog posts"
              />
              <button className="blog-icon-btn" aria-label="Search">
                🔎
              </button>
            </div>

            <div className="blog-select-wrap">
              <select
                className="blog-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort blog posts"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="blog-hero">
          <div className="blog-hero-left">
            <h1>Discover tasty ideas</h1>
            <p>Recipes, tips, and quick inspiration — curated for you.</p>
            <div className="blog-mini">
              <span className="pill">🔥 Trending</span>
              <span className="pill">🍲 Recipes</span>
              <span className="pill">⚡ Quick Tips</span>
            </div>
          </div>

          <div className="blog-hero-card">
            <div className="hero-stat">
              <span className="hero-stat-num">{filtered.length}</span>
              <span className="hero-stat-label">Total Posts</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{Math.min(visibleCount, filtered.length)}</span>
              <span className="hero-stat-label">Showing</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">4.8⭐</span>
              <span className="hero-stat-label">Rating</span>
            </div>
          </div>
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="blog-empty">
            <h2>No posts found</h2>
            <p>Try a different keyword.</p>
            <button
              className="blog-secondary-btn"
              onClick={() => {
                setSearch('');
                setSort('newest');
                setVisibleCount(9);
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="blog-grid">
              {shown.map((blog) => {
                const imgUrl = getImageUrl(blog);
                const created = new Date(blog.sys?.createdAt || Date.now());

                return (
                  <article key={blog.sys.id} className="blog-card">
                    <div className="blog-media">
                      {imgUrl ? (
                        <img src={imgUrl} alt={blog.fields.title || "Blog image"} loading="lazy" />
                      ) : (
                        <div className="blog-fallback-img">No Image</div>
                      )}

                      <div className="blog-overlay">
                        <span className="chip">
                          {created.toLocaleDateString()}
                        </span>
                        <span className="chip chip-ghost">5 min read</span>
                      </div>
                    </div>

                    <div className="blog-card-body">
                      <h2>{blog.fields.title}</h2>
                      <p>{blog.fields.description || 'No description available'}</p>

                      <div className="blog-card-footer">
                        <Link to={`/blog/${blog.sys.id}`} className="blog-read">
                          Read full →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="blog-more">
                <button className="blog-secondary-btn" onClick={() => setVisibleCount((v) => v + 6)}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;

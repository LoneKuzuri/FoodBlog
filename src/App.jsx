// src/App.jsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ✅ Add categories per recipe so filter works
  const featuredRecipes = [
    {
      id: 1,
      title: "Creamy Pasta Carbonara",
      time: "20 mins",
      difficulty: "Easy",
      rating: 4.8,
      emoji: "🍝",
      category: "Dinner"
    },
    {
      id: 2,
      title: "Grilled Tofu Bowl",
      time: "15 mins",
      difficulty: "Easy",
      rating: 4.6,
      emoji: "🥗",
      category: "Lunch"
    },
    {
      id: 3,
      title: "Chocolate Lava Cake",
      time: "30 mins",
      difficulty: "Medium",
      rating: 4.9,
      emoji: "🍰",
      category: "Desserts"
    },
    {
      id: 4,
      title: "Fluffy Pancakes",
      time: "18 mins",
      difficulty: "Easy",
      rating: 4.7,
      emoji: "🥞",
      category: "Breakfast"
    },
    {
      id: 5,
      title: "Spicy Snack Wrap",
      time: "12 mins",
      difficulty: "Easy",
      rating: 4.5,
      emoji: "🌯",
      category: "Snacks"
    }
  ];

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks'];

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return featuredRecipes.filter((r) => {
      const matchCategory = selectedCategory === 'All' || r.category === selectedCategory;
      const matchSearch = !term || r.title.toLowerCase().includes(term);
      return matchCategory && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  // Keep currentRecipe index valid after filtering
  const activeRecipe = filteredRecipes[currentRecipe] || filteredRecipes[0];

  const getRandomRecipe = () => {
    if (!filteredRecipes.length) return;
    const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
    setCurrentRecipe(randomIndex);
  };

  const handleSearch = () => {
    // reset to first item after searching
    setCurrentRecipe(0);
  };

  return (
    <div className="home">
      {/* ✅ HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title">Delicious Recipes</h1>
            <p className="hero-subtitle">
              Explore tasty, quick, and healthy food ideas daily — and read cooking tips on our blog.
            </p>

            {/* ✅ Search Bar */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input"
                aria-label="Search recipes"
              />
              <button className="search-btn" onClick={handleSearch} aria-label="Search">
                🔍
              </button>
            </div>

            {/* ✅ Category Filter */}
            <div className="category-row" role="tablist" aria-label="Recipe categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentRecipe(0);
                  }}
                  role="tab"
                  aria-selected={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* ✅ CTAs */}
            <div className="cta-row">
              <button className="primary-btn" onClick={getRandomRecipe}>
                🎲 Surprise me
              </button>

              <Link to="/blog" className="link-btn">
                Read Blogs →
              </Link>
            </div>

            {/* ✅ Quick Stats */}
            <div className="stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Cooks</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.8⭐</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>

          {/* ✅ Featured Card */}
          <div className="hero-right">
            <div className="featured-card">
              <div className="featured-top">
                <span className="badge">Recipe of the Day</span>
                <span className="badge subtle">{activeRecipe?.category || 'All'}</span>
              </div>

              {filteredRecipes.length ? (
                <>
                  <div className="featured-emoji" aria-hidden="true">
                    {activeRecipe.emoji}
                  </div>
                  <h3 className="featured-title">{activeRecipe.title}</h3>

                  <div className="featured-meta">
                    <span>⏱️ {activeRecipe.time}</span>
                    <span>📊 {activeRecipe.difficulty}</span>
                    <span>⭐ {activeRecipe.rating}</span>
                  </div>

                  {/* dots for filtered list */}
                  <div className="dots">
                    {filteredRecipes.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentRecipe ? 'active' : ''}`}
                        onClick={() => setCurrentRecipe(index)}
                        aria-label={`Select recipe ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="empty-state">
                    <h3>No recipes found</h3>
                    <p>Try a different keyword or category.</p>
                    <button
                      className="secondary-btn"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                        setCurrentRecipe(0);
                      }}
                    >
                      Reset filters
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ✅ Feature list */}
            <ul className="feature-list">
              <li>✅ Quick recipes</li>
              <li>🍓 Healthy ingredients</li>
              <li>🔥 Easy-to-follow steps</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ✅ Quick Links */}
      <section className="quick-section">
        <h2 className="section-title">Explore</h2>
        <div className="quick-grid">
          <Link to="/categories" className="quick-card">
            <div className="quick-icon">📚</div>
            <div>
              <h3>Browse Categories</h3>
              <p>Find recipes by meals & cravings.</p>
            </div>
          </Link>

          <Link to="/favorites" className="quick-card">
            <div className="quick-icon">❤️</div>
            <div>
              <h3>My Favorites</h3>
              <p>Save and revisit your best picks.</p>
            </div>
          </Link>

          <Link to="/about" className="quick-card">
            <div className="quick-icon">ℹ️</div>
            <div>
              <h3>About Us</h3>
              <p>Learn about our cooking journey.</p>
            </div>
          </Link>
        </div>

        {/* ✅ Blog CTA */}
        <div className="blog-cta">
          <div>
            <h3>Want cooking tips & recipes?</h3>
            <p>Read our latest blog posts and improve your cooking every day.</p>
          </div>
          <Link to="/blog" className="primary-btn">
            Go to Blog
          </Link>
        </div>
      </section>
    </div>
  );
}

export default App;

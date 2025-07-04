// src/App.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const featuredRecipes = [
    {
      id: 1,
      title: "Creamy Pasta Carbonara",
      time: "20 mins",
      difficulty: "Easy",
      rating: 4.8,
      image: "🍝"
    },
    {
      id: 2,
      title: "Grilled Tofu",
      time: "15 mins",
      difficulty: "Easy",
      rating: 4.6,
      image: "🥗"
    },
    {
      id: 3,
      title: "Chocolate Lava Cake",
      time: "30 mins",
      difficulty: "Medium",
      rating: 4.9,
      image: "🍰"
    }
  ];

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks'];

  const getRandomRecipe = () => {
    const randomIndex = Math.floor(Math.random() * featuredRecipes.length);
    setCurrentRecipe(randomIndex);
  };

  return (
    <div className="main">
      <div className="sub-div">
        <header className="header-section">
          <h1>Delicious Recipes...</h1>
          <p className="intro-text">Explore tasty, quick, and healthy food ideas daily!</p>
        </header>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search for recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="category-section">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="featured-recipe">
          <h3>Recipe of the Day</h3>
          <div className="recipe-card">
            <div className="recipe-icon">{featuredRecipes[currentRecipe].image}</div>
            <div className="recipe-info">
              <h4>{featuredRecipes[currentRecipe].title}</h4>
              <div className="recipe-meta">
                <span className="time">⏱️ {featuredRecipes[currentRecipe].time}</span>
                <span className="difficulty">📊 {featuredRecipes[currentRecipe].difficulty}</span>
                <span className="rating">⭐ {featuredRecipes[currentRecipe].rating}</span>
              </div>
            </div>
          </div>

          <div className="recipe-dots">
            {featuredRecipes.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentRecipe ? 'active' : ''}`}
                onClick={() => setCurrentRecipe(index)}
              />
            ))}
          </div>
        </div>

        <ul className="features">
          <li>✅ Quick Recipes</li>
          <li>🍓 Healthy Ingredients</li>
          <li>🔥 Easy-to-Follow Steps</li>
        </ul>

        <div className="action-buttons">
          <button className="random-btn" onClick={getRandomRecipe}>
            🎲 Random Recipe
          </button>
          <Link to="/blog">
            <button className="find-btn">Read Blogs</button>
          </Link>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Recipes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Happy Cooks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.8⭐</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>

        <div className="quick-links">
          <Link to="/categories" className="quick-link">Browse Categories</Link>
          <Link to="/favorites" className="quick-link">My Favorites</Link>
          <Link to="/about" className="quick-link">About Us</Link>
        </div>
      </div>
    </div>
  );
}

export default App;

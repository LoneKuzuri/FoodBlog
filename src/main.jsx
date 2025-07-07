import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import Blog from './blogpage/Blog.jsx';
import SingleBlog from './blogpage/SingleBlog.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  
  {
    path: '/blog',
    element: <Blog />
  },
  {
    path: '/blog/:id',
    element: <SingleBlog />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

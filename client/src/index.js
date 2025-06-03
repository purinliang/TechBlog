import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import PostDetail from './components/PostDetail';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="new" element={<NewPost />} />
        <Route path="posts/:id" element={<PostDetail />} />
      </Route>
    </Routes>
  </Router>
);

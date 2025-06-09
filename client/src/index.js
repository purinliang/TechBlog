import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import MyPostsPage from "./pages/MyPostsPage";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import PostDetail from "./components/PostDetail";
import AuthPage from "./pages/AuthPage";
import { UserProvider } from "./UserContext";
import "./index.css";
import LikedPostsPage from "./pages/LikedPostsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Main() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route
              path="myposts"
              element={
                <ProtectedRoute>
                  <MyPostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="likedposts"
              element={
                <ProtectedRoute>
                  <LikedPostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="newpost"
              element={
                <ProtectedRoute>
                  <NewPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="editpost/:id"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

root.render(<Main />);

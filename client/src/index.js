import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import PostDetail from "./components/PostDetail";
import AuthPage from "./pages/AuthPage";
import { UserProvider } from "./UserContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Main() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="new_post" element={<NewPost />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="edit_post/:id" element={<EditPost />} />
            <Route path="auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

root.render(<Main />);

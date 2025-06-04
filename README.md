# TechBlog

A full-stack blog platform where users can view, create, update, and delete blog posts.
This platform provides a user-friendly interface and seamless interaction with the backend.
Built with **React**, **Node.js**, and **PostgreSQL**.

## Tech Stack & Architecture

Frontend: React + Fetch API
Backend: Node.js + Express
Database: PostgreSQL (via Supabase)

[Architecture Diagram - TODO]

## Live Demo

**Frontend (Render):** https://techblog-frontend-tue4.onrender.com/

**Backend (Render):** https://techblog-backend-gcyj.onrender.com/

## Management Dashboards

**Render Dashboard:** https://dashboard.render.com/

(Manage your deployments and view logs.)

**Supabase Dashboard:** https://supabase.com/dashboard/

(Handle database management and authentication.)

## Fully RESTful API

All API routes are prefixed with `/posts`.

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/posts`     | Retrieve all blog posts  |
| GET    | `/posts/:id` | Retrieve a post by ID    |
| POST   | `/posts`     | Create a new blog post   |
| PUT    | `/posts/:id` | Update a blog post       |
| DELETE | `/posts/:id` | Delete a blog post by ID |

## Implementation Details

**Backend Route File:** `server/routes/postRoutes.js`

**Frontend API File:** `client/src/postApi.js`

## Installation & Local Dev

### 1. Clone the repo

```bash
git clone https://github.com/.../TechBlog.git
cd TechBlog
```

### 2. Setup Environment

Set up `.env` in both `client` and `server` with:

```plain
# client/.env
REACT_APP_API_BASE=http://localhost:5000
```

```plain
# server/.env
PORT=5000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 3. Start the frontend

```bash
cd client
npm install
npm start
```

View at: http://localhost:3000/

### 4. Start the backend

```bash
cd server
npm install
node index.js
```

View at: http://localhost:5000/posts

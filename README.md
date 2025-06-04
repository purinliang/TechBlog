# TechBlog

A full-stack blog platform where users can view, create, update, and delete blog posts. Built with **React**, **Node.js**, and **PostgreSQL**.

## Tech Stack & Architecture

Frontend: React + Fetch API
Backend: Node.js + Express
Database: PostgreSQL (via Supabase)

[Architecture Diagram – TODO]

## Live Demo

Frontend (Render): https://techblog-frontend-tue4.onrender.com/
Backend (Render): https://techblog-backend-gcyj.onrender.com/

## Management Dashboards

Render Dashboard: https://dashboard.render.com/
Supabase Dashboard: https://supabase.com/dashboard/

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
**Frontend API File:** `client/src/api.js`
_(Consider renaming it to `postApi.js` for clarity.)_

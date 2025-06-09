# TechBlog

A full-stack blog platform where users can view, create, update, and delete blog posts.
This project provides a user-friendly interface and seamless interaction between frontend and backend.

**Repo:** https://github.com/purinliang/TechBlog

**Frontend (Render):** https://techblog-frontend-tue4.onrender.com/

**Backend (Render):** https://techblog-backend-gcyj.onrender.com/

## Tech Stack & Architecture

```plain
| Component | Technology        |
| --------- | ----------------- |
| Frontend  | React + Fetch API |
| Backend   | Node.js + Express |
| Database  | PostgreSQL        |
```

[Architecture Diagram - TODO]

## Live Demo

Deployed for better demonstration and testing.

**Frontend (Render):** Hosted React app to interact with the backend.

https://techblog-frontend-tue4.onrender.com/

**Backend (Render):** RESTful API server handling all blog post operations.

https://techblog-backend-gcyj.onrender.com/

### Management Dashboard

**Render Dashboard:** Manage your deployments and view logs.

https://dashboard.render.com/

**Database (Supabase):** PostgreSQL-compatible cloud DB with easy web UI.

https://supabase.com/dashboard/

## Fully RESTful API

All API routes are prefixed with `/posts`.

```plain
| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/posts`     | Retrieve all blog posts  |
| GET    | `/posts/:id` | Retrieve a post by ID    |
| POST   | `/posts`     | Create a new blog post   |
| PUT    | `/posts/:id` | Update a blog post       |
| DELETE | `/posts/:id` | Delete a blog post by ID |
```

## Implementation Details

### 🔐 Auth

User registration and login are handled through dedicated API routes (`/auth/register` and `/auth/login`) using `bcryptjs` for secure password hashing and `jsonwebtoken` (JWT) for stateless authentication.

- During registration, passwords are hashed before being stored in the database.

- After a successful login or registration, a JWT token containing the `userId` and `username` is generated and returned to the frontend.

- This token is stored in the frontend (e.g., `localStorage`) and used in future requests to access protected routes.

The frontend uses an `authApi` module to communicate with these routes and handle token-based authentication flow.

### 📝 Post

Post creating, updating, and deleting are implemented in `postRoutes.js` and protected by JWT-based middleware.

- Only authenticated users can create new posts.

- For updating or deleting a post, the server checks whether the `userId` extracted from the JWT token matches the `author_id` of the post.

- The frontend attaches the JWT token to each request that modifies post data, ensuring proper access control.

API calls related to posts are managed in the frontend via the `postApi` module.

## Installation & Local Development

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/TechBlog.git
cd TechBlog
```

### 2. Setup Environment

Create `.env` files in both `client/` and `server/`:

```bash
# client/.env
REACT_APP_API_BASE=http://localhost:5000
```

```bash
# server/.env
PORT=5000
JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY
```

### 3. Start the backend

```bash
cd server
npm install
node index.js
```

Visit: http://localhost:5000/posts

### 4. Start the frontend

```bash
cd client
npm install
npm start
```

Visit: http://localhost:3000/

### 5. [Optional] Set Up Local PostgreSQL

#### 5.1 Init PostgreSQL

Install PostgreSQL (if not already installed)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Start the PostgreSQL service (if not already started)

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Check the PostgreSQL service:

```bash
sudo systemctl status postgresql
```

#### 5.2 Create Database and User

Log in as the PostgreSQL superuser:

```bash
sudo -u postgres psql
```

Then run the following commands:

```sql
DROP DATABASE IF EXISTS techblog;
DROP USER IF EXISTS techblog_admin;

CREATE DATABASE techblog;
CREATE USER techblog_admin WITH PASSWORD 'techblog_password';
GRANT ALL PRIVILEGES ON DATABASE techblog TO techblog_admin;
```

Then Exit with `\q`.

#### 5.3 Change Authentication Method (from peer to md5)

Find the `pg_hba.conf` path:

```bash
sudo -u postgres psql -c "SHOW hba_file;"
```

Edit the file (e.g., `/etc/postgresql/16/main/pg_hba.conf`):

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Find this line:

```plain
local   all             all                                     peer
```

Change it to:

```plain
local   all             all                                     md5
```

Save and exit, then restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

#### 5.4 Initialize Tables

Please refer to `database/README.md`.

#### 5.5 Test the Connection

Please refer to `database/README.md`.

#### 5.6 Config backend environment

Set up `.env` in `server` with:

```bash
# server/.env
USE_LOCAL_POSTGRESQL=true
LOCAL_POSTGRESQL_URL=postgresql://techblog_admin:techblog_password@localhost:5432/techblog
```

Make sure only one database method is active at a time.

### 6. [Optional] Switch to Supabase

#### 6.1 Setup Supabase

Create a supabase account then config the `.env` in `server` with:

```bash
# server/.env
USE_SUPABASE=true
SUPABASE_URL=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

#### 6.2 Initialize Tables

Please refer to `database/README.md`.

Make sure only one database method is active at a time.

### 7. Init Redis

```bash
docker-compose up -d
docker exec -it techblog_redis_1 redis-cli
```

In redis-cli:

```bash
PING # The result should be "PONG"
```

Or on upstash: https://console.upstash.com/redis/

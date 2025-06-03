import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <header className="mb-4 border-b pb-2">
        <h1 className="text-3xl font-bold">TechBlog</h1>
        <nav className="mt-2 space-x-4">
          <Link to="/">Home</Link>
          <Link to="/new">New Post</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

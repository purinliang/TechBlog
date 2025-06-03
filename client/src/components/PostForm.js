import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost({ title, content });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Title</label>
        <input
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block">Content</label>
        <textarea
          className="border p-2 w-full"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Post
      </button>
    </form>
  );
}

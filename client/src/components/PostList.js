import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <ul className="space-y-2">
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/posts/${post.id}`} className="text-blue-600 hover:underline">
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

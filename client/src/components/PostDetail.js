import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostById } from '../api';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostById(id).then(setPost);
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
}

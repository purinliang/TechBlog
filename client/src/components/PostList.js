import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {posts.map((post) => (
        <Card key={post.id} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
          <CardContent>
            <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
              <Typography variant="h6" color="primary" fontWeight="600" gutterBottom>
                {post.title}
              </Typography>
            </Link>
            <Typography variant="body2" color="text.secondary" noWrap>
              {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

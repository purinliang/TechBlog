import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostById } from '../api';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostById(id).then(setPost);
  }, [id]);

  if (!post)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Card sx={{ maxWidth: 700, margin: '20px auto', p: 2 }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          {post.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}
        >
          {post.content}
        </Typography>
      </CardContent>
    </Card>
  );
}

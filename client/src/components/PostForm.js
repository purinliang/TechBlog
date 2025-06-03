import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <TextField
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Content"
        variant="outlined"
        multiline
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
      />
      <Button variant="contained" type="submit" size="large">
        Post
      </Button>
    </Box>
  );
}

import PostForm from '../components/PostForm';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export default function NewPost() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" fontWeight="600" mb={3} color="primary">
        Create a New Post
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <PostForm />
      </Paper>
    </Box>
  );
}

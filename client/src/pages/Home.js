import PostList from '../components/PostList';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight="600" mb={3} color="primary">
        All Posts
      </Typography>
      <PostList />
    </Box>
  );
}

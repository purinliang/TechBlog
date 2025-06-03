import { Outlet, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function App() {
  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto', fontFamily: 'Roboto, sans-serif' }}>
      <header>
        <Typography variant="h2" fontWeight="bold" color="primary" gutterBottom>
          TechBlog
        </Typography>
        <Stack direction="row" spacing={4} mb={4}>
          <Link to="/" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: '500' }}>
            Home
          </Link>
          <Link to="/new" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: '500' }}>
            New Post
          </Link>
        </Stack>
      </header>
      <Outlet />
    </Box>
  );
}

import PostList from "../components/PostList";
import { Card, Typography, CardContent } from "@mui/material";

export default function Home() {
  return (
    <>
      <Card
        variant="outlined"
        sx={{ p: 2, "&:hover": { boxShadow: 8 }, gap: 3 }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="600" mb={4} color="primary">
            Post List
          </Typography>
          <PostList />
        </CardContent>
      </Card>
    </>
  );
}

import PostList from '../components/PostList';

export default function Home() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">All Posts</h2>
      <PostList />
    </div>
  );
}

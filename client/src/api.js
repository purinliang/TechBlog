const API_BASE = "http://localhost:5000";

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) {
    throw new Error(`Error fetching posts: ${res.statusText}`);
  }
  return res.json();
}

export async function getPostById(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (!res.ok) {
    throw new Error(`Error fetching post ID ${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function createPost(data) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Error creating post: ${res.statusText}`);
  }
  return res.json();
}

export async function updatePost(id, data) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Error updating post ID ${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Error deleting post ID ${id}: ${res.statusText}`);
  }
  return res.json();
}

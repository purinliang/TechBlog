const API_BASE = process.env.REACT_APP_API_BASE;

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || res.statusText);
  }
  console.log(data);
  return data;
}

export async function getPosts() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/posts`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return handleResponse(res);
}

export async function getMyPosts() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/posts/myposts`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return handleResponse(res);
}

export async function getPostById(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return handleResponse(res);
}

export const createPost = async ({ title, content }) => {
  console.log(title);
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
};

export async function updatePost(id, { title, content }) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

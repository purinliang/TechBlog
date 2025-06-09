// client/src/apis/commentApi.js
const API_BASE = process.env.REACT_APP_API_BASE;

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || res.statusText);
  }
  return data;
}

export async function getCommentsByPostId(postId) {
  const res = await fetch(`${API_BASE}/comments/post/${postId}`);
  return handleResponse(res);
}

export async function createComment({ post_id, content, parent_comment_id }) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ post_id, content, parent_comment_id }),
  });
  return handleResponse(res);
}

export async function updateComment(id, { content }) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return handleResponse(res);
}

export async function deleteComment(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/comments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

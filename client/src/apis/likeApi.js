const API_BASE = process.env.REACT_APP_API_BASE;

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || res.statusText);
  }
  console.log(data);
  return data;
}

export async function getLikeCount(postId) {
  const res = await fetch(`${API_BASE}/likes/${postId}/count`);
  return handleResponse(res);
}

export async function getLikeStatus(postId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/likes/${postId}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function likePost(postId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/likes/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function unlikePost(postId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/likes/${postId}/unlike`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

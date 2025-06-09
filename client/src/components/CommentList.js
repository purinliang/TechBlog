import { useEffect, useState } from "react";
import { Typography, Box, TextField, Button, Alert } from "@mui/material";
import CommentCard from "./CommentCard";
import { getCommentsByPostId, createComment } from "../apis/commentApi";
import { Skeleton } from "@mui/material";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [replyError, setReplyError] = useState({});
  const [loading, setLoading] = useState(true);

  function SkeletonCommentCard({ level = 0 }) {
    return (
      <Box sx={{ pl: level * 2, mb: 2 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ mt: 1, borderRadius: 1 }}
        />
      </Box>
    );
  }

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getCommentsByPostId(postId);
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setCommentError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (text, parentId = null) => {
    try {
      const newComment = await createComment({
        post_id: postId,
        content: text,
        parent_comment_id: parentId,
      });
      setComments((prev) => [...prev, newComment]);
      // The reply count need to be refreshed
      // window.location.reload();
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError("Failed to submit comment");
    }
  };

  const handleReplyComment = async (text, parentId) => {
    try {
      const newComment = await createComment({
        post_id: postId,
        content: text,
        parent_comment_id: parentId,
      });
      setComments((prev) => [...prev, newComment]);
      setReplyError((prev) => ({ ...prev, [parentId]: null }));
      // The reply count need to be refreshed
      // window.location.reload();
    } catch (err) {
      console.error("Error posting reply:", err);
      setReplyError((prev) => ({
        ...prev,
        [parentId]: "Failed to submit reply",
      }));
    }
  };

  const topLevel = comments.filter((c) => !c.parent_comment_id);
  const repliesMap = comments.reduce((map, c) => {
    if (c.parent_comment_id) {
      map[c.parent_comment_id] = [...(map[c.parent_comment_id] || []), c];
    }
    return map;
  }, {});

  const renderComments = (list, level = 0) => {
    if (list.length === 0) {
      return (
        <Alert severity="info" sx={{ py: 1, fontSize: "1rem" }}>
          No comments yet. Login/register and be the first to comment!
        </Alert>
      );
    }

    return list.map((c) => (
      <Box key={c.id}>
        <CommentCard
          comment={c}
          onReplySubmit={handleReplyComment}
          level={level}
        />
        {replyError[c.id] && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {replyError[c.id]}
          </Alert>
        )}
        {repliesMap[c.id] && renderComments(repliesMap[c.id], level + 1)}
      </Box>
    ));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" color="primary" fontWeight="600" gutterBottom>
        Comments
      </Typography>

      <Box sx={{ mt: 1 }}>
        {loading
          ? [...Array(1)].map((_, idx) => <SkeletonCommentCard key={idx} />)
          : renderComments(topLevel)}
      </Box>

      <Typography
        variant="h6"
        color="primary"
        fontWeight="600"
        sx={{ mt: 3 }}
        gutterBottom
      >
        Add a New Comment
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write something..."
      />
      {commentError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {commentError}
        </Alert>
      )}
      <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (newComment.trim()) {
              handleSubmitComment(newComment);
              setNewComment("");
            }
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

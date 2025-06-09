import { useEffect, useState } from "react";
import { Typography, Box, TextField, Button, Alert } from "@mui/material";
import CommentCard from "./CommentCard";
import { getCommentsByPostId, createComment } from "../apis/commentApi";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsByPostId(postId);
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setCommentError("Failed to load comments");
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
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError("Failed to submit comment");
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
          onReplySubmit={handleSubmitComment}
          level={level}
        />
        {repliesMap[c.id] && renderComments(repliesMap[c.id], level + 1)}
      </Box>
    ));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" color="primary" fontWeight="600" gutterBottom>
        Comments
      </Typography>

      {commentError && <Alert severity="error">{commentError}</Alert>}

      <Box sx={{ mt: 1 }}>{renderComments(topLevel)}</Box>

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

// client/src/components/CommentList.js
import CommentCard from "./CommentCard";
import { Typography, Box, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";

export default function CommentList({ comments, onSubmitComment }) {
  const [newComment, setNewComment] = useState("");

  const topLevel = comments.filter((c) => !c.parent_comment_id);
  const repliesMap = comments.reduce((map, c) => {
    if (c.parent_comment_id) {
      map[c.parent_comment_id] = [...(map[c.parent_comment_id] || []), c];
    }
    return map;
  }, {});

  const renderComments = (list) => {
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
          onReplySubmit={(text, parentId) => onSubmitComment(text, parentId)}
        />
        {repliesMap[c.id] && renderComments(repliesMap[c.id])}
      </Box>
    ));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" color="primary" fontWeight="600" gutterBottom>
        Comments
      </Typography>

      <Box sx={{ mt: 1 }}>{renderComments(topLevel)}</Box>

      <TextField
        label="Add a comment"
        fullWidth
        multiline
        minRows={3}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{ mt: 3 }}
      />
      <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (newComment.trim()) {
              onSubmitComment(newComment);
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

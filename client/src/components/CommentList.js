// client/src/components/CommentList.js
import CommentCard from "./CommentCard";
import { Box, TextField, Button } from "@mui/material";
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

  const renderComments = (list) =>
    list.map((c) => (
      <Box key={c.id}>
        <CommentCard
          comment={c}
          onReplySubmit={(text, parentId) => onSubmitComment(text, parentId)}
        />
        {repliesMap[c.id] && renderComments(repliesMap[c.id])}
      </Box>
    ));

  return (
    <Box sx={{ mt: 4 }}>
      <TextField
        label="Add a comment"
        fullWidth
        multiline
        minRows={3}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
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

      <Box sx={{ mt: 3 }}>{renderComments(topLevel)}</Box>
    </Box>
  );
}

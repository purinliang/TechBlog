// client/src/components/CommentCard.js
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Collapse,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Reply } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

export default function CommentCard({ comment, onReplySubmit }) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    if (replyContent.trim()) {
      onReplySubmit(replyContent, comment.id);
      setReplyContent("");
      setShowReply(false);
    }
  };

  return (
    <Box sx={{ ml: comment.parent_comment_id ? 4 : 0, mt: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {comment.author_username || "Anonymous"} -{" "}
            {new Date(comment.created_at).toLocaleString()}
          </Typography>
          <ReactMarkdown>{comment.content}</ReactMarkdown>

          <IconButton
            size="small"
            onClick={() => setShowReply((prev) => !prev)}
          >
            <Reply fontSize="small" />
          </IconButton>

          <Collapse in={showReply} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                label="Reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" size="small" onClick={handleReply}>
                  Submit
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
}

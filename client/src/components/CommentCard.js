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

export default function CommentCard({
  comment,
  onReplySubmit,
  level = 0,
  isLoggedIn,
}) {
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
    <Box sx={{ ml: Math.min(level, 5) * 4, mt: 2 }}>
      <Card variant="outlined">
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pl: 2,
            pr: 2,
            pb: 0,
          }}
        >
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {comment.content}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "space-between",
              minWidth: "180px",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              by {comment.author_username || "Anonymous"} {" | at "}
              {new Date(comment.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              })}
            </Typography>

            <IconButton
              size="small"
              onClick={() => {
                if (isLoggedIn) setShowReply((prev) => !prev);
              }}
              disabled={!isLoggedIn}
              title={!isLoggedIn ? "Login required to reply" : ""}
              sx={{ alignSelf: "flex-end" }}
            >
              <Reply fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>

        <Collapse in={showReply} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={2}
              label="Reply"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              disabled={!isLoggedIn}
              placeholder={
                isLoggedIn ? "Write your reply..." : "Login to reply"
              }
              title={!isLoggedIn ? "Login required to write reply" : ""}
            />
            <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleReply}
                disabled={!isLoggedIn || !replyContent.trim()}
                title={!isLoggedIn ? "Login required to submit reply" : ""}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
}

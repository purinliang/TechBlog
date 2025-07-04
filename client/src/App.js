import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  CssBaseline,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import UserStatus from "./components/UserStatus";

export default function App() {
  const theme = useTheme();
  const isDesktop = false;
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileDrawer = () => setMobileOpen((prev) => !prev);

  const desktopDrawerWidth = "20vw";
  const mobileDrawerWidth = 200;

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  function ProtectedMenuItem({ to, label }) {
    return isLoggedIn ? (
      <ListItem
        button
        component={Link}
        to={to}
        onClick={() => !isDesktop && setMobileOpen(false)}
      >
        <ListItemText
          primary={label}
          primaryTypographyProps={{ color: theme.palette.text.primary }}
        />
      </ListItem>
    ) : (
      <Tooltip title="Please login/register first" arrow>
        <ListItem
          button
          disabled
          sx={{ cursor: "default" }}
          onClick={(e) => e.preventDefault()}
        >
          <ListItemText
            primary={label}
            primaryTypographyProps={{ color: theme.palette.text.disabled }}
          />
        </ListItem>
      </Tooltip>
    );
  }

  const drawerContent = (
    <>
      <Toolbar />
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          onClick={() => !isDesktop && setMobileOpen(false)}
        >
          <ListItemText
            primary="Home"
            primaryTypographyProps={{ color: theme.palette.text.primary }}
          />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ProtectedMenuItem to="/newpost" label="New Post" />
        <ProtectedMenuItem to="/myposts" label="My Posts" />
        <ProtectedMenuItem to="/likedposts" label="Liked Posts" />
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          backgroundColor: theme.palette.primary.dark,
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: theme.palette.common.white }}
          >
            TechBlog
          </Typography>
          <UserStatus />
        </Toolbar>
      </AppBar>

      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: desktopDrawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: desktopDrawerWidth,
              maxWidth: 300,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: mobileDrawerWidth,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          mb: 16,
          px: 2,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", mt: 6 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

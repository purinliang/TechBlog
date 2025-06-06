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
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import UserStatusButton from "./components/UserStatusButton";

export default function App() {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:1440px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileDrawer = () => setMobileOpen((prev) => !prev);

  const desktopDrawerWidth = "20vw";
  const mobileDrawerWidth = 200;

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
        <ListItem
          button
          component={Link}
          to="/new_post"
          onClick={() => !isDesktop && setMobileOpen(false)}
        >
          <ListItemText
            primary="New Post"
            primaryTypographyProps={{ color: theme.palette.text.primary }}
          />
        </ListItem>
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
          <UserStatusButton />
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

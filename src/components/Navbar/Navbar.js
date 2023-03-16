import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./Navbar.css";
import { LockOpen } from "@mui/icons-material";

function Navbar() {
  const onClick = () => {
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    window.history.go(0);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" className="title">
            <Link className="homeLink" to="/">
              Home
            </Link>
          </Typography>
          <Typography variant="h6" component="div">
            {localStorage.getItem("currentUser") == null ? (
              <Link className="homeLink" to="/auth">
                Login/Register
              </Link>
            ) : (
              <div>
                <IconButton onClick={onClick} className="homeLink">
                  <LockOpen></LockOpen>
                </IconButton>
                <Link
                  className="homeLink"
                  to={{
                    pathname: "/users/" + localStorage.getItem("currentUser"),
                  }}
                >
                  User
                </Link>
              </div>
            )}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

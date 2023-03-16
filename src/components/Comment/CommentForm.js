import {
  Avatar,
  Button,
  CardContent,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PostWithAuth, RefreshToken } from "../../services/HttpService";
import "./Comment.css";

function CommentForm(props) {
  const { userId, userName, postId, setCommentRefresh } = props;

  const [text, setText] = useState("");

  const logout = () => {
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    window.history.go(0);
  };

  const handleChange = (value) => {
    setText(value);
  };

  const saveComment = () => {
    PostWithAuth("/comments", {
      postId: postId,
      userId: userId,
      text: text,
    })
      .then((res) => {
        if (!res.ok) {
          RefreshToken()
            .then((res) => {
              if (!res.ok) {
              } else {
                res.json();
              }
            })
            .then((result) => {
              if (result != undefined) {
                localStorage.setItem("tokenKey", result.accessToken);
                saveComment();
                setCommentRefresh();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    saveComment();
    setText("");
    setCommentRefresh();
  };

  return (
    <CardContent className="comment">
      <OutlinedInput
        id="outlined-adornment-amount"
        multiline
        inputProps={{ maxLength: 250 }}
        fullWidth
        onChange={(i) => handleChange(i.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <Link className="link" to={{ pathname: "/users/" + userId }}>
              <Avatar aria-label="recipe" className="avatar">
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          </InputAdornment>
        }
        style={{ color: "black", backgroundColor: "white" }}
        endAdornment={
          <InputAdornment position="end">
            <Button variant="contained" onClick={handleSubmit}>
              Comment
            </Button>
          </InputAdornment>
        }
        value={text}
      ></OutlinedInput>
    </CardContent>
  );
}

export default CommentForm;

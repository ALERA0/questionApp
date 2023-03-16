import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./Home.css";

import Container from "@mui/material/Container";
import PostForm from "../Post/PostForm";

function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postList, setPostList] = useState([]);

  const refreshPosts = () => {
    fetch("/posts")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setPostList(result);
        },
        (error) => {
          console.log(error)
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  if (error) {
    return <div> Error!!! </div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container fixed className="container">
        {localStorage.getItem("currentUser") == null ? (
          ""
        ) : (
          <PostForm
            userId={localStorage.getItem("currentUser")}
            userName={localStorage.getItem("userName")}
            refreshPosts={refreshPosts}
          />
        )}

        {postList.map((post) => (
          <Post
            likes={post.postLikes}
            postId={post.id}
            userId={post.userId}
            userName={post.userName}
            title={post.title}
            text={post.text}
          ></Post>
        ))}
      </Container>
    );
  }
}

export default Home;

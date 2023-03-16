import React, { useEffect, useRef, useState } from "react";
import "./Post.css";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";
import { DeleteWithAuth, PostWithAuth } from "../../services/HttpService";

function Post(props) {
  const { title, text, userName, userId, postId, likes } = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const isInitialMount = useRef(true);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [refresh,setRefresh]= useState(false);

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  let disabled = localStorage.getItem("currentUser") == null ? true : false;

  const setCommentRefresh=()=>{
    setRefresh(true);
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
    refreshComments();
    console.log(commentList);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      saveLike();
      setLikeCount(likeCount + 1);
    } else {
      deleteLike();
      setLikeCount(likeCount - 1);
    }
  };

  const refreshComments = () => {
    fetch("/comments?postId=" + postId)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCommentList(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
      setRefresh(false);
  };

  
  const saveLike = () => {
    PostWithAuth("/likes",{
      postId: postId,
      userId: localStorage.getItem("currentUser")
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const deleteLike = () => {
    DeleteWithAuth("/likes/" + likeId)
    .catch((err) => console.log(err));
  };

  const checkLikes = () => {
    var likeControl = likes.find((like) => ""+like.userId === localStorage.getItem("currentUser"));
    if (likeControl != null) {
      setLikeId(likeControl.id);
      console.log(likeId);
      setIsLiked(true);
    }
  };
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else refreshComments();
  }, [refresh]);

  useEffect(() => {
    checkLikes();
  }, []);

  return (
    <Card className="root">
      <CardHeader
        avatar={
          <Link className="homeLink" to={{ pathname: "/users/" + userId }}>
            <Avatar className="avatar" aria-label="recipe">
            
            </Avatar>
          </Link>
        }
        title={title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {disabled ? (
          <IconButton
            disabled
            onClick={handleLike}
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton>
        ) : (
          <IconButton onClick={handleLike} aria-label="add to favorites">
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton>
        )}

        {likeCount}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>
            {error
              ? "error"
              : isLoaded
              ? commentList.map((comment) => (
                  <Comment
                    userId={comment.userId}
                    userName={comment.userName}
                    text={comment.text}
                  ></Comment>
                ))
              : "Loading"}
            {disabled ? (
              ""
            ) : (
              <CommentForm
                setCommentRefresh={setCommentRefresh}
                userId={localStorage.getItem("currentUser")}
                userName={localStorage.getItem("userName")}
                postId={postId}
              ></CommentForm>
            )}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default Post;

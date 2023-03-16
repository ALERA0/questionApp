import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Avatar.css";
import {
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Modal,
  Radio,
} from "@mui/material";
import { PutWithAuth } from "../../services/HttpService";

function Avatar(props) {
  const {avatarId,userId,userName} = props;
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(avatarId);

  const saveAvatar=()=>{
    PutWithAuth("/users/"+localStorage.getItem("currentUser"),{
      avatar : selectedValue,
    })
    .then((res)=> res.json())
    .catch((err)=> console.log(err))
  }


  const handleOpen = () => {
    setOpen(true);
    
  };

  const handleClose = () => {
    setOpen(false);
    saveAvatar();
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <Card className="avatarRoot">
        <CardMedia
          component="img"
          alt="User Avatar"
          image={`/avatars/avatar${selectedValue}.png`}
          title="User Avatar"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User info
          </Typography>
        </CardContent>
        <CardActions>
        {localStorage.getItem("currentUser") == userId ? <Button size="small" onClick={handleOpen}>
        Change Avatar
      </Button> : ""}
          
        </CardActions>
      </Card>
      <Modal
      className="modal"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <List
          dense
          sx={{ width: "100%", maxWidth: 360, backgroundColor: "background.paper" }}
        >
        {[1, 2, 3, 4, 5, 6].map((key) => {
            const labelId = `checkbox-list-secondary-label-${key}`;
            return (
              <ListItem key={key} button>
                  <CardMedia
                  style = {{maxWidth: 100}}
                  component="img"
                  alt={`Avatar n°${key}`}
                  image={`/avatars/avatar${key}.png`}
                  title="User Avatar"
                  />
                <ListItemSecondaryAction>
                  <Radio
                    edge="end"
                    value= {key}
                    onChange={handleChange}
                    checked={""+selectedValue === ""+key}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Modal>
    </div>
  );
}

export default Avatar;

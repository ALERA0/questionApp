import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetWithAuth } from "../../services/HttpService";
import Avatar from "../Avatar/Avatar";
import UserActivity from "../UserActivity/UserActivity";
import "./User.css";

function User() {
  const {userId} = useParams();
  const [user,setUser]=useState();

  const getUser=()=>{
    GetWithAuth("/users/" +userId)
    .then(res=>res.json())
    .then((result)=>{
      console.log(result);
      setUser(result);
    },
    (error)=>{
      console.log(error)
    }
    )
  }

  useEffect(()=>{
    getUser();
  },[])


  return (
    <div className="userDivRoot">
      {user? <Avatar avatarId={user.avatarId} userId={userId} userName={user.userName}/> :""}
      {localStorage.getItem("currentUser") == userId ? <UserActivity userId={userId}/> :""}
    </div>
  );
}

export default User;

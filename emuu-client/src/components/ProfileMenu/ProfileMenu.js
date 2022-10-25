import "./ProfileMenu.scss";
import React, {useState} from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { useHistory, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDoc, where } from "firebase/firestore";
import { db } from "../../Firebase.js";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isMenuVisible,setIsMenuVisible]=useState(false);
  const profileImage = localStorage.getItem("userImage");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Sign Out Function in Nav Bar
  const history = useHistory();
  const auth = getAuth;

  const navAuth = localStorage.getItem("auth");
  let userFirstInitial;

  if (auth === true) {
    userFirstInitial = localStorage
      .getItem("displayName")
      .charAt(0)
      .toUpperCase();
  }

  const SignedOut = async (e) => {
    signOut(auth)
      .then(() => {
        console.log("User is signed out");
        history.push("/");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {navAuth === "true" ? (
        <>
          <Box
            sx={{ display: "flex", flexDirection: "column" }}
          >
              <IconButton
                onClick={()=>setIsMenuVisible(isMenuVisible=>!isMenuVisible)}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={ isMenuVisible === true ? { width: 40, height: 40, marginRight: "-155px !important" } : { width: 40, height: 40 }}>
                  {userFirstInitial}
                </Avatar>
              </IconButton>

          <div style = {{display: isMenuVisible===false && "none", height: "0px", width: "200px", paddingTop: "0px", background: "red !important"}}>

          <div style = {{display: "flex", flexDirection: "column", backgroundColor: "white", borderTopLeftRadius: "20px", borderTopRightRadius: "15px", paddingTop: "10px", paddingLeft: "10px", paddingBottom: "10px"}}>

          <Link style={{display: "flex", flexDirection: "row", paddingBottom: "5px", textDecoration: "none", color: "black"}} onClick={()=> {history.push("/UserProfile")}}>
          <Avatar />
          <Typography sx={{marginLeft: "5px !important", marginTop: "5px !important"}}>Profile</Typography>
          </Link>

          <Link style={{display: "flex", flexDirection: "row", textDecoration: "none", color: "black"}} onClick={()=> {history.push("/Upload")}}>
          <CloudUploadIcon
           sx={{ marginRight: "6px" }}
           fontSize="large"
           />
          <Typography sx={{marginLeft: "5px !important", marginTop: "5px !important"}}>Upload Video</Typography>
          </Link>

          </div>

          <div style={{backgroundColor: "gray", height: "1px"}} />



          <Link style={{display: "flex", flexDirection: "row", color: "red", border: "1px solid black", borderTop: "0px transparent", textDecoration: "none", backgroundColor: "white", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px"}} onClick={()=> { SignedOut(); localStorage.setItem("auth", false); history.push("/"); localStorage.setItem("user", null); localStorage.setItem("displayName", null)}}>
          <Logout sx={{ marginTop: "5px" }} fontSize="small" />
          <Typography sx={{marginLeft: "5px !important", marginTop: "2.5px !important"}}>Logout</Typography>
          </Link>

          </div>
          </Box>

 </>
//          <div style={{display:'flex',flexDirection:'column'}}>
//            <MenuItem
//              onClick={() => {
//                history.push("/UserProfile");
//              }}
//            >
//              <Avatar />{" "}
//              <Typography sx={{ marginLeft: "5px" }}>Profile</Typography>
//            </MenuItem>
//            <MenuItem
//              onClick={() => {
//                history.push("/Upload");
//              }}
//            >
//              <CloudUploadIcon
//                sx={{ marginLeft: "-5px", marginRight: "12px" }}
//                fontSize="large"
//              />
//              Upload Video
//            </MenuItem>
//            </div>
//            <Divider />
//            <MenuItem
//              onClick={() => {
//                SignedOut();
//                localStorage.setItem("auth", false);
//                history.push("/");
//                localStorage.setItem("user", null);
//                localStorage.setItem("displayName", null);
//
//              }}
//            >
//              <ListItemIcon>
//                <Logout fontSize="small" />
//              </ListItemIcon>
//              Logout
//            </MenuItem>
//          </Menu>


      ) : (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Link className="login__link" to="/login">
            <LoginIcon
              sx={{ color: "white", marginRight: "5px", marginTop: "-2px" }}
              fontSize="medium"
            />
            Login
          </Link>
        </div>
      )}
    </React.Fragment>
  );
}

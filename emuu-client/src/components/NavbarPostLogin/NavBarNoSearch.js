import React, { useState, useEffect } from "react";
import "./HeaderPostLogin.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { db } from "../../Firebase.js";
import { collection, getDocs } from "firebase/firestore";

import EmuuLogo from "./EmuuLogo.png";

import ProfileMenu from "../ProfileMenu/ProfileMenu";

function NavBarNoSearch() {
  //Sign Out Function in Nav Bar
  const [user, setUser] = useState([]);
  const userName = localStorage.getItem("displayName");

  async function getUser() {
    //Get user data
    const querySnapshotUsers = await getDocs(collection(db, "Users"));
    const usersArr = [];

    querySnapshotUsers.forEach((doc) => {
      usersArr.push(doc.data());
    });
    const userArr = usersArr.filter((user) => user.Username === userName);
    setUser(userArr);
    localStorage.setItem("userImage", userArr[0].ProfilePictureUrl);
  }
  useEffect(() => getUser(), []);
  return (
    <>
      {[false].map((expand) => (
        <Navbar
          key={expand}
          bg="dark"
          variant="dark"
          expand={expand}
          className="navbar"
        >
          <Container fluid>
            <Navbar.Brand href="/">
              <img src={EmuuLogo} width="140" height="40"></img>
            </Navbar.Brand>

            <ProfileMenu />
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavBarNoSearch;

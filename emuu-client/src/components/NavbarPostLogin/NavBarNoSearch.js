import React, { useState, useEffect } from "react";
import "./HeaderPostLogin.scss";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { Routes, Route, useHistory } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/app";
import { db } from "../../Firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import EmuuLogo from "./EmuuLogo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HeaderSearch from "./TestAlgoliaSearchInput";

import ProfileMenu from "../ProfileMenu/ProfileMenu";

function NavBarNoSearch({ search, setSearch }) {
  //Sign Out Function in Nav Bar
  const [user, setUser] = useState([]);
  const history = useHistory();
  const auth = getAuth;
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

  const SignedOut = async (e) => {
    signOut(auth)
      .then(() => {
        history.push("/");
        //TestUserStatus()
      })
      .catch((error) => {
        // An error happened.
      });
  };
  useEffect(() => getUser(), []);
  const navAuth = localStorage.getItem("auth");
  return (
    <>
      {[false].map((expand) => (
        <Navbar
          key={expand}
          bg="dark"
          variant="dark"
          expand={expand}
          className="mb-3"
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

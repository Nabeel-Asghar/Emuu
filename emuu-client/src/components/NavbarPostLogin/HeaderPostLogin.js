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

function HeaderPostLogin({ search, setSearch }) {
  //Sign Out Function in Nav Bar
  const [user, setUser] = useState([]);
  const history = useHistory();
  const auth = getAuth;
  const userName = localStorage.getItem("displayName");

  const SignedOut = async (e) => {
    signOut(auth)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  //   useEffect(() => getUser(), []);
  const navAuth = localStorage.getItem("auth");
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
            <HeaderSearch />
            <ProfileMenu />
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default HeaderPostLogin;

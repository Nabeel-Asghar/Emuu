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

import EmuuLogo from "./EmuuLogo.png";

function NavBarNoImage() {
  //Sign Out Function in Nav Bar

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
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavBarNoImage;

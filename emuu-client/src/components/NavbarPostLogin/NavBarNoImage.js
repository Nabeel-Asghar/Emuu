import React from "react";
import "./HeaderPostLogin.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

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

import React from "react";
import "./HeaderPostLogin.scss";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import EmuuLogo from "./EmuuLogo.png";
import HeaderSearch from "./TestAlgoliaSearchInput";
import ProfileMenu from "../ProfileMenu/ProfileMenu";

function HeaderPostLogin() {
  //Sign Out Function in Nav Bar

  //   useEffect(() => getUser(), []);
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

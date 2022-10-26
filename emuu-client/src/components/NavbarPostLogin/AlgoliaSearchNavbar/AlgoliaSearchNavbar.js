import React, { useRef, useContext } from "react";
import "../HeaderPostLogin.scss";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";

import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import AppContext from "../../../AppContext";

import EmuuLogo from "../EmuuLogo.png";

const AlgoliaSearchNavbar = ({ autocomplete, searchInput }) => {
  const isMenuOpen = useContext(AppContext).isMenuOpen;
  const inputFocusRef = useRef(null);
  const inputFocusProp = {
    ref: inputFocusRef,
  };

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
            <Form
              className="d-flex"
              {...autocomplete.getRootProps({})}
              style={isMenuOpen ? { marginRight: "-134px" } : {}}
            >
              <input
                {...inputFocusProp}
                {...autocomplete.getInputProps({})}
                className="search__input"
                value={searchInput}
                placeholder="Search..."
              />
            </Form>
            <ProfileMenu />
          </Container>
        </Navbar>
      ))}
    </>
  );
};

export default AlgoliaSearchNavbar;

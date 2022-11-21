import React, { useRef } from "react";
import "../HeaderPostLogin.scss";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import "./AlgoliaSearchNavbar.scss";
import ProfileMenu from "../../ProfileMenu/ProfileMenu";

import EmuuLogo from "../EmuuLogo.png";

const AlgoliaSearchNavbar = ({ autocomplete, searchInput }) => {
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
            <Form className="d-flex" {...autocomplete.getRootProps({})}>
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

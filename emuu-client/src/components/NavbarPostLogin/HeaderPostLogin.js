import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

import { Routes, Route, useHistory } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/app";

function HeaderPostLogin() {
  //Sign Out Function in Nav Bar
  const history = useHistory();
  const auth = getAuth;

  const SignedOut = async (e) => {
    signOut(auth)
      .then(() => {
        console.log("User is signed out");
        localStorage.clear();
        history.push("/");
        //TestUserStatus()
      })
      .catch((error) => {
        // An error happened.
      });
  };

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
              <img
                src="https://firebasestorage.googleapis.com/v0/b/emuu-1ee85.appspot.com/o/images%2FPicture2.png?alt=media&token=c2e0afa7-7f0b-4b75-b9f9-e38043b729bb"
                width="140"
                height="40"
              ></img>
            </Navbar.Brand>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="btn btn-success">Search</Button>
            </Form>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title
                  id={`offcanvasNavbarLabel-expand-${expand}`}
                ></Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  {navAuth === "false" && (
                    <Nav.Link href="/Login">Login</Nav.Link>
                  )}
                  {navAuth === "true" && (
                    <>
                      <Nav.Link href="/UserProfile">User Profile</Nav.Link>
                      <Nav.Link href="/Upload">Upload</Nav.Link>

                      {
                        <button
                          onClick={() => {
                            SignedOut();
                            localStorage.setItem("auth", false);
                            window.location.reload();
                            localStorage.setItem("user", null);
                          }}
                          type="submit"
                          button
                          class="btn me-4 btn-dark btn-lg"
                        >
                          Sign Out
                        </button>
                      }
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default HeaderPostLogin;

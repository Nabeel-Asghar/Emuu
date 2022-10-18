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

import EmuuLogo from "./EmuuLogo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import ProfileMenu from "../ProfileMenu/ProfileMenu";

function HeaderPostLogin({ search, setSearch }) {
  //Sign Out Function in Nav Bar
  const history = useHistory();
  const auth = getAuth;

  const SignedOut = async (e) => {
    signOut(auth)
      .then(() => {
        console.log("User is signed out");
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
              <img src={EmuuLogo} width="140" height="40"></img>
            </Navbar.Brand>
            <Form className="d-flex">
              <input
                value={search}
                placeholder="search"
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  borderTopLeftRadius: "15px",
                  borderBottomLeftRadius: "15px",
                  paddingLeft: "20px",
                }}
              />
              <Button
                className="search-btn"
                variant="btn btn-success search-btn"
                style={{
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px",
                  marginTop: "1px",
                }}
              >
                {" "}
                <Link className="search-btn__title" to="/search">
                  Search
                </Link>
              </Button>
            </Form>
            <ProfileMenu />

          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default HeaderPostLogin;

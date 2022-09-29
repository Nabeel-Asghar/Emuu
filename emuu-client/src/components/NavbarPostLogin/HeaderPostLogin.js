import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

import {Routes, Route, useHistory} from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged, getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import firebase from 'firebase/app';
//import TestUserStatus from '../UserAuthentication/UserStatus'





function HeaderPostLogin() {

    const history = useHistory()
    const auth = getAuth();

    let token ="";


    let value = false;



onAuthStateChanged(auth, async (user) => {
         if (user) {
            //retrieves token
           token = await getIdToken(user);
           let value = true;


         }
        else{
        let value = false;

        }
       });





    const SignedOut = async(e) => {


        signOut(auth).then(() => {

            console.log("User is signed out");
            history.push("/home")
            const user = auth.currentUser
            //TestUserStatus()
        }).catch((error) => {
      // An error happened.
        });
    }


  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} bg="dark" variant = "dark" expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="/Home">EMUU</Navbar.Brand>
             <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>

                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                    { !value && <Nav.Link href="/Login">Login</Nav.Link>}
                    { value && <Nav.Link href="/UserProfile">User Profile</Nav.Link>}
                    { value && <Nav.Link href="/Upload">Upload</Nav.Link>}
                    { value && <button onClick={()=>SignedOut()} type="submit" button class="btn me-4 btn-dark btn-lg">Sign Out</button>}
                </Nav>

              </Offcanvas.Body>
            </Navbar.Offcanvas>

          </Container>
        </Navbar>
      ))}
    </>
  )
}
export default HeaderPostLogin;

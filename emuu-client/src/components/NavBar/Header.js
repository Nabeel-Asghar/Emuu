import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function Header() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="\Home">EMUU</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="\Login">Login</Nav.Link>
            <Nav.Link href="\Register">Register</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      </div>
      );
      }
 export default Header
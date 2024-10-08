import React from 'react';
import { Navbar, Nav, Flex } from 'react-bootstrap';
import './StyleSheets/MyNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faHome, faDollarSign, faCog } from '@fortawesome/free-solid-svg-icons'; // Import specific icons


const MyNavbar = () => {

  return (
    <Navbar bg="dark" variant="dark" className="flex-column container">
      <Nav className="flexRow">
        <div className="flexRowChild">
          <Nav.Link  href="#Dashboard"><FontAwesomeIcon icon={faHome}  style={{ fontSize: '22px', marginRight:'10px' ,marginBottom:'2px' }}/> Dashboard</Nav.Link>
          <Nav.Link  href="#Income"><FontAwesomeIcon icon={faDollarSign}  style={{ fontSize: '22px', marginRight:'10px' ,marginBottom:'2px' }}/> Income</Nav.Link>

        </div>
        
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;

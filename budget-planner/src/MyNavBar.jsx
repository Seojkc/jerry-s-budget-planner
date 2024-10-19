import React from 'react';
import { Navbar, Nav, Flex } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './StyleSheets/MyNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faHome, faDollarSign, faCog, faFileChartColumn } from '@fortawesome/free-solid-svg-icons'; // Import specific icons


const MyNavbar = () => {

  return (
    <Navbar bg="dark" variant="dark" className="flex-column container">
      <Nav className="flexRow">
        <div className="flexRowChild">
          <Link to="/dashboard" className="nav-link">
            <FontAwesomeIcon icon={faHome} style={{ fontSize: '22px', marginRight: '10px', marginBottom: '2px' }} /> 
            Dashboard
          </Link>          
          <Link to="/income" className="nav-link">
            <FontAwesomeIcon icon={faDollarSign} style={{ fontSize: '22px', marginRight: '10px', marginBottom: '2px' }} /> 
            Income
          </Link>
          <Link to="/Report" className="nav-link">
            <FontAwesomeIcon icon={faDollarSign} style={{ fontSize: '22px', marginRight: '10px', marginBottom: '2px' }} /> 
            Report
          </Link>
          <Link to="/income" className="nav-link">
            <FontAwesomeIcon icon={faCog} style={{ fontSize: '22px', marginRight: '10px', marginBottom: '2px' }} /> 
            Bills
          </Link>
        </div>
        
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;

import React from 'react';
import { Navbar, Nav, Flex } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './StyleSheets/MyNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faHome, faDollarSign, faCog, faFileChartColumn } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import MissMinuteRight from './ExternalFiles/Miss_Minutes_29.png'


const MyNavbar = () => {

  return (
    <Navbar bg="dark" variant="dark" className="flex-column container">
      <Nav className="flexRow">
        <div className="flexRowChild">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>          
          
          <Link to="/report" className="nav-link">
            Report
          </Link>
          <Link to="/Bills" className="nav-link">
            Bills
          </Link>
          <Link to="/Customise" className="nav-link">
            Customise
          </Link>
        </div>
        
        <div >
          <img src={MissMinuteRight} className='miss-minute-right'/>
        </div>
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;

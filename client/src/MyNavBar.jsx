import React, { useState } from 'react';
import { Navbar, Nav, Flex } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './StyleSheets/MyNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faHome, faDollarSign, faCog, faFileChartColumn } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import MissMinuteRight from './ExternalFiles/Miss_Minutes_29.png'


const MyNavbar = () => {

  const [currentActive,setCurrentActive]=useState("Dashboard")

  const clicked=(e)=>{
    const name = e.currentTarget.dataset.name;
    setCurrentActive(name);
    console.log("clicked",name)
  }

  return (
    <Navbar bg="dark" variant="dark" className="flex-column container">
      <Nav className="flexRow">
        <div className="flexRowChild">
            {["Dashboard", "Report", "Bills", "Customise"].map((name) => (
              <div
                key={name}
                onClick={clicked}
                data-name={name}
                className={currentActive === name ? "active-this" : ""}
              >
                <Link to={`/${name.toLowerCase()}`} className="nav-link">
                  {name}
                </Link>
              </div>
            ))}
        </div>
        <div >
          <img src={MissMinuteRight} className='miss-minute-right'/>
        </div>
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;

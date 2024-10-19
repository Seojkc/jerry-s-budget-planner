import logo from './logo.svg';
import './App.css';
import MyNavbar from './MyNavBar';
import Dashboard from './Pages/Dashboard';
import Income from './Pages/Income';
import React from 'react';
import { Container,Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Container fluid>
          <div className='Row-Container'>
            <div className='nav-bar'>
              <MyNavbar/>
            </div>
            <div className='main-page'>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />

              </Routes>
            </div>
            
          </div>
        </Container>
      </div>
    </Router>
    
  );
}

export default App;

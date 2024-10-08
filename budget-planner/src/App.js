import logo from './logo.svg';
import './App.css';
import MyNavbar from './MyNavBar';
import Dashboard from './Pages/Dashboard';
import React from 'react';
import { Container,Row, Col } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col md={3}>
            <MyNavbar/>
          </Col>
          <Col md={9}>
            <Dashboard/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

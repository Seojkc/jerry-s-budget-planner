import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MyNavbar from './MyNavBar';
import Dashboard from './Pages/Dashboard';
import Bills from './Pages/Bills';
import Report from './Pages/Report';
import Customise from './Pages/Customise';

// Create your theme
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>  {/* ThemeProvider is wrapping the app */}
      <Router>
        <div className="App">
          <Container fluid>
            <div className="Row-Container">
              <div className="nav-bar">
                <MyNavbar />
              </div>
              <div className="main-page">
                <Routes className="Routes-main-content">
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/Bills" element={<Bills />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/Customise" element={<Customise />} />
                </Routes>
                <footer>
                  <p className="copy-right">Powered by SeoVision Digital</p>
                </footer>
              </div>
            </div>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

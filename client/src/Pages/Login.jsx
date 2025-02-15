// LoginPage.jsx
import { useState, useEffect } from 'react';
import Particles from 'react-tsparticles';  
import axios from 'axios';
//import '../StyleSheets/Login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const particlesInit = async (main) => {
   // await loadFull(main);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await axios.post('/api/login', { username, password });
    //   if (response.data.success) {
    //     setLoggedIn(true);
    //     fetchData();
    //   }
    // } catch (error) {
    //   console.error('Login failed:', error);
    // }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Data fetch failed:', error);
    }
  };

  return (
    <div className="container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: '#0a192f' } },
          particles: {
            number: { value: 50 },
            color: { value: '#64ffda' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: {
              enable: true,
              speed: 0.5,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
            },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
            },
          },
        }}
      />

      {!loggedIn ? (
        <div className="login-box">
          <h1 className="neon-text">Welcome</h1>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="highlight"></span>
              <span className="bar"></span>
              <label className="input-label">Username</label>
            </div>
            
            <div className="input-group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="highlight"></span>
              <span className="bar"></span>
              <label className="input-label">Password</label>
            </div>

            <button type="submit" className="glow-button">
              <span className="btn-text">Login</span>
              <div className="fill"></div>
            </button>
          </form>
        </div>
      ) : (
        <div className="data-table">
          <h2 className="neon-text">Secure Data</h2>
          <table className="hologram-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className="status-indicator"></span>
                    Active
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
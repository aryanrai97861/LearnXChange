import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';
import websocket from './utils/websocket';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <CircularProgress />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <CircularProgress />
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/dashboard" />;
};

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Connect WebSocket when user is authenticated
    if (user) {
      websocket.connect(user.token); // Use actual user token if available
      
      // Set up WebSocket event listeners
      const handleMessage = (data) => {
        console.log('Received WebSocket message:', data);
        // Handle different types of messages here
      };

      const handleConnectionStatus = (isConnected) => {
        console.log('WebSocket connection status:', isConnected);
      };

      websocket.on('message', handleMessage);
      websocket.on('connected', handleConnectionStatus);

      // Cleanup on unmount
      return () => {
        websocket.off('message', handleMessage);
        websocket.off('connected', handleConnectionStatus);
        websocket.disconnect();
      };
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
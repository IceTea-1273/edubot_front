import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import ContinentSelector from './ContinentSelector';
import { useUserContext, UserProvider } from './UserContext';
import SelectDifficulty from './SelectDifficulty';
import Header from './Header';
import Register from './Register';
import Quiz from './Quiz';
import ResultPage from './ResultPage';
import Leaderboard from './Leaderboard';

function AppRoutes() {
  const { token, setToken } = useUserContext();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, [token, setToken]);

  return (
      <>
          <Header />
      <Routes>
        <Route path="/" element={<Navigate to={token?.trim() ? "/select-continent" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select-continent" element={token ? <ContinentSelector /> : <Navigate to="/login" />} />
        <Route path="/select-difficulty" element={token ? <SelectDifficulty /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={token ? <Quiz /> : <Navigate to="/login" />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/leaderboard" element={token ? <Leaderboard /> : <Navigate to="/login" />}  />
      </Routes>
      </>
  );
}

function App() {
  return (
      <UserProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserProvider>
  );
}

export default App;

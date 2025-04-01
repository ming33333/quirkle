import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import AddQuestions from './components/addQuestions';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Store the logged-in user

  return (
    <Router>
      <div className="App">
        <Header user={user} />
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          {/* Protected Routes */}
          <Route
            path="/"
            element={user ? <MainContent /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-questions"
            element={user ? <AddQuestions /> : <Navigate to="/login" />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
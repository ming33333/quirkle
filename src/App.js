import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebaseAuthentication'; // Import the auth object
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import AddQuestions from './components/addQuiz';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [loading, setLoading] = useState(true); // Track whether the app is checking the auth state
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Track the selected quiz

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the logged-in user
      setLoading(false); // Stop loading once the auth state is determined
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth state
  }

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
            element={user ? <MainContent email={user.email} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz} /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-questions"
            element={user ? <AddQuestions email={user.email} /> : <Navigate to="/login" />}
          />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
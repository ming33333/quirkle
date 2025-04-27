import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebase/firebaseAuthentication.js'; // Import the auth object
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import AddQuestions from './components/pages/addQuiz';
import Login from './components/pages/login';
import StudyRoom from './components/pages/StudyRoom.js';
import UserSearch from './components/pages/userSearch'; // Import the UserSearch component
import AcceptFriends from './components/pages/acceptFriends'; // Import the UserSearch component

import './styles/App.css';

function App() {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [loading, setLoading] = useState(true); // Track whether the app is checking the auth state
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Track the selected quiz
  const [selectedTitle, setSelectedTitle] = useState(null); // Track the selected quiz title
  // const location = useLocation(); // Hook to access the current location
  // const initialData = location.state || null; // Retrieve initialData from the state

  // const quizData = {
  //   title: 'Sample Quiz',
  //   questions: [
  //     { question: 'What is React?', answer: 'A JavaScript library for building user interfaces.' },
  //     { question: 'What is JSX?', answer: 'A syntax extension for JavaScript.' },
  //   ],
  // };
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
        <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />
          {/* Login Route */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          {/* Protected Routes */}
          <Route
            path="/home"
            element={user ? <MainContent email={user.email} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz} selectedTitle={selectedTitle} setSelectedTitle={setSelectedTitle}  /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-questions"
            element={user ? <AddQuestions email={user.email}/> : <Navigate to="/login" />}
          />
          <Route
            path="/study-room"
            element={user ? <StudyRoom email={user.email} /> : <Navigate to="/login" />}
          />
          <Route
              path="/user-search"
              element={user ? <UserSearch email={user.email} /> : <Navigate to="/login" />}
            />
          <Route
              path="/accept-friends"
              element={user ? <AcceptFriends currentUserEmail={user.email} /> : <Navigate to="/login" />}
            />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
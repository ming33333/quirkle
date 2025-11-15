import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase/firebaseAuthentication.js'; // Import the auth object

import Header from './components/Header';
import MainContent from './components/MainContent';

import AddQuiz from './services/addQuiz.js';
import Login from './pages/login';
import SpacedLearningQuiz from './pages/spacedLearningQuiz.js';
import StudyRoom from './pages/StudyRoom.js';
import UserSearch from './services/userSearch.js'; // Import the UserSearch component
import AcceptFriends from './services/acceptFriends.js'; // Import the UserSearch component
import Store from './pages/store'
import Welcome from './pages/welcome.js';

import './styles/App.css';
import QuizView from './components/quiz'; // Import the QuizView component

function App() {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [loading, setLoading] = useState(true); // Track whether the app is checking the auth state
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Track the selected quiz
  const [selectedTitle, setSelectedTitle] = useState(null); // Track the selected quiz title
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setShowAnswer(false); // Hide answer when navigating to previous question
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, selectedQuiz.length - 1));
    setShowAnswer(false); // Hide answer when navigating to next question
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };
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
    path="/" element={ <Welcome user={user}/> }
    />
    <Route path="/login" element={<Login setUser={setUser} user={user} />} />
    /* Protected Routes */
    <Route
      path="/home"
      element={
        user ? (
          <MainContent
            email={user.email}
            selectedQuiz={selectedQuiz}
            setSelectedQuiz={setSelectedQuiz}
            selectedTitle={selectedTitle}
            setSelectedTitle={setSelectedTitle}
          />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
    <Route
      path="/quiz-view"
      element={
        user ? (
          <QuizView
          selectedQuiz={selectedQuiz}
          selectedTitle={selectedTitle}
          currentQuestionIndex={currentQuestionIndex} // Initialize currentQuestionIndex
          setSelectedQuiz={setSelectedQuiz}
          handlePrevQuestion={handlePrevQuestion} // Placeholder for handlePrevQuestion function
          handleNextQuestion={handleNextQuestion} // Placeholder for handleNextQuestion function
          toggleAnswerVisibility={toggleAnswerVisibility} // Placeholder for toggleAnswerVisibility function
          showAnswer={showAnswer} // Default value for showAnswer
            email={user.email}
            questionAnswered={questionAnswered}
            setQuestionAnswered={setQuestionAnswered}
          />
          ) : (
          <Navigate to="/login" />
          )
        }
        />
        <Route
          path="/add-questions"
          element={
          user ? <AddQuiz email={user.email} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/spaced-learning"
          element={
          user ? (
            <SpacedLearningQuiz
            email={user.email}
            selectedQuiz={selectedQuiz}
            selectedTitle={selectedTitle}
            setSelectedQuiz={setSelectedQuiz}
            handlePrevQuestion={handlePrevQuestion} // Placeholder for handlePrevQuestion function
            handleNextQuestion={handleNextQuestion} // Placeholder for handleNextQuestion function
            toggleAnswerVisibility={toggleAnswerVisibility} // Placeholder for toggleAnswerVisibility function
            showAnswer={showAnswer} // Default value for showAnswer
            />
          ) : (
            <Navigate to="/login" />
          )
          }
        />
        {/* <Route
          path="/study-room"
          element={
          user ? <StudyRoom email={user.email} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/user-search"
          element={
          user ? <UserSearch email={user.email} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/accept-friends"
          element={
          user ? (
            <AcceptFriends currentUserEmail={user.email} />
          ) : (
            <Navigate to="/login" />
          )
          }
        />
        <Route
          path="/store"
          element={
          user ? <Store email={user.email} /> : <Navigate to="/login" />
          }
        /> */}
    {/* <Route
    path="/add-questions"
    element={user ? <AddQuiz email={user.email} /> : <Navigate to="/login" />}
    /> */}
    {/* <Route
    path="/test"
    element={user ? <QuizView /> : <Navigate to="/login" />}
    /> */}
    </Routes>

    </div>
    </Router>
  );
}

export default App;
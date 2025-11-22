import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase/firebaseAuthentication.js';

import Header from './components/Header';
import MainContent from './components/MainContent';
import AddQuiz from './services/addQuiz.js';
import Login from './pages/login';
import SpacedLearningQuiz from './pages/spacedLearning.js';
import { GlobalProvider } from './context/GlobalContext';
import Welcome from './pages/welcome.js';
import QuizView from './components/quiz';

import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setShowAnswer(false);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, selectedQuiz.length - 1));
    setShowAnswer(false);
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <GlobalProvider>
      <Router>
        <div className="App">
          <Header user={user} />
          <Routes>
            <Route path="/" element={<Welcome user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} user={user} />} />
            
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
                    currentQuestionIndex={currentQuestionIndex}
                    setSelectedQuiz={setSelectedQuiz}
                    handlePrevQuestion={handlePrevQuestion}
                    handleNextQuestion={handleNextQuestion}
                    toggleAnswerVisibility={toggleAnswerVisibility}
                    showAnswer={showAnswer}
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
                    handlePrevQuestion={handlePrevQuestion}
                    handleNextQuestion={handleNextQuestion}
                    toggleAnswerVisibility={toggleAnswerVisibility}
                    showAnswer={showAnswer}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;

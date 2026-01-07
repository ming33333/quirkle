import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase/firebaseAuthentication.js";

import Header from "./components/Header";
import { GlobalProvider } from "./context/GlobalContext";
import { createAppRoutes } from "./routes/AppRoutes";
import { createAdminRoutes } from "./routes/AdminRoutes";

import "./styles/App.css";

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
    setShowAnswer(false);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, selectedQuiz.length - 1)
    );
    setShowAnswer(false);
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
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
            {createAppRoutes({
              user,
              setUser,
              selectedQuiz,
              setSelectedQuiz,
              selectedTitle,
              setSelectedTitle,
              currentQuestionIndex,
              handlePrevQuestion,
              handleNextQuestion,
              toggleAnswerVisibility,
              showAnswer,
              questionAnswered,
              setQuestionAnswered,
            })}
            {createAdminRoutes({ user })}
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;

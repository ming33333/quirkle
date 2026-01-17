/**
 * AppRoutes.js - Route Definitions for Regular Application Pages
 *
 * This file defines all the standard application routes (non-admin routes).
 * It exports a function that returns an array of Route elements for React Router.
 *
 * Key Points:
 * - Contains routes for: home, login, quiz-view, add-questions, spaced-learning
 * - Handles basic authentication checks (redirects to login if not authenticated)
 * - Similar structure to AdminRoutes.js, but for regular user routes
 *
 * Routes included:
 * - "/" - Welcome page (public)
 * - "/login" - Login page (public)
 * - "/home" - Main content dashboard (protected - requires login)
 * - "/quiz-view" - Quiz viewing page (protected - requires login)
 * - "/add-questions" - Quiz creation page (protected - requires login)
 * - "/spaced-learning" - Spaced learning quiz page (protected - requires login)
 *
 * @param {Object} props - Route props including user, handlers, and state
 * @returns {Array} Array of Route elements for standard app routes
 */
import React from "react";
import { Route, Navigate } from "react-router-dom";
import Welcome from "../pages/welcome.js";
import Login from "../pages/login";
import MainContent from "../components/MainContent";
import QuizView from "../components/quizView";
import AddQuiz from "../services/addQuiz.js";
import SpacedLearningQuiz from "../pages/spacedLearning.js";

export const createAppRoutes = ({
  user,
  setUser,
  selectedQuiz,
  setSelectedQuiz,
  selectedTitle,
  setSelectedTitle,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  handlePrevQuestion,
  handleNextQuestion,
  toggleAnswerVisibility,
  showAnswer,
  questionAnswered,
  setQuestionAnswered,
}) => {
  return [
    <Route key="/" path="/" element={<Welcome user={user} />} />,
    <Route
      key="/login"
      path="/login"
      element={<Login setUser={setUser} user={user} />}
    />,
    <Route
      key="/home"
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
    />,
    <Route
      key="/quiz-view"
      path="/quiz-view"
      element={
        user ? (
          <QuizView
            selectedQuiz={selectedQuiz}
            selectedTitle={selectedTitle}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
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
    />,
    <Route
      key="/add-questions"
      path="/add-questions"
      element={user ? <AddQuiz email={user.email} /> : <Navigate to="/login" />}
    />,
    <Route
      key="/spaced-learning"
      path="/spaced-learning"
      element={
        user ? (
          <SpacedLearningQuiz
            email={user.email}
            selectedQuiz={selectedQuiz}
            selectedTitle={selectedTitle}
            setSelectedQuiz={setSelectedQuiz}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            handlePrevQuestion={handlePrevQuestion}
            handleNextQuestion={handleNextQuestion}
            toggleAnswerVisibility={toggleAnswerVisibility}
            showAnswer={showAnswer}
          />
        ) : (
          <Navigate to="/login" />
        )
      }
    />,
  ];
};

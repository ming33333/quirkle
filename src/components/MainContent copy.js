import React, { useState } from 'react';

const MainContent = ({ selectedQuiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!selectedQuiz) {
    return <div className="main-content">Please select a quiz from the sidebar.</div>;
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setShowAnswer(false); // Hide answer when navigating to previous question
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, selectedQuiz.questions.length - 1));
    setShowAnswer(false); // Hide answer when navigating to next question
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const questionCount = selectedQuiz.questions.length;

  return (
    <div className="main-content">
      <h2>{selectedQuiz.title}</h2>
      <div className="question-navigation">
        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
          &lt; Prev
        </button>
        <div className="question">
          <strong>Q{currentQuestionIndex + 1}/{questionCount}:</strong> {currentQuestion.question}
          <br />
          <button onClick={toggleAnswerVisibility}>
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          {showAnswer && (
            <div>
              <strong>A:</strong> {currentQuestion.answer}
            </div>
          )}
        </div>
        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === selectedQuiz.questions.length - 1}>
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default MainContent;
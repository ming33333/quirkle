import React from 'react';

const QuizBoxes = ({ quizzes, setSelectedQuiz }) => {
  return (
    <div className="quiz-boxes-container">
      {Object.keys(quizzes).map((key, index) => (
        <div
          key={index}
          className="quiz-box"
          onClick={() => setSelectedQuiz(quizzes[key])} // Update the selected quiz
          style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate it's clickable
        >
          <h3>{key}</h3> {/* Display the key (quiz name) in each quiz box */}
        </div>
      ))}
    </div>
  );
};

export default QuizBoxes;
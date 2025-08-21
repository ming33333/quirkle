import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizBoxes = ({ quizzes, setSelectedQuiz, setSelectedTitle }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [clickedQuiz, setClickedQuiz] = useState(null); // Track which quiz box is clicked

  return (
    <div className="quiz-boxes-container">
      {/* Render quiz boxes */}
      {Object.keys(quizzes).map((key, index) => (
        <div
          key={index}
          className="quiz-option"
          onClick={() => {
            setSelectedQuiz(quizzes[key]["questions"]); // Set the selected quiz
            setSelectedTitle(key); // Set the selected title
          }}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
          <div className="quiz-header">
            <h3>{key}</h3> {/* Display the key (quiz name) */}
            <h2 className="quiz-date"> 
              Last Accessed: {quizzes[key]["lastAccessed"] 
                ? new Date(quizzes[key]["lastAccessed"]).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  }) 
                : 'n/a'}</h2> {/* Display the date */}
          </div>
          {clickedQuiz === key && (
            <div className="click-options">
              <button
                onClick={() => {
                  setSelectedQuiz(quizzes[key]["questions"]); // Set the selected quiz
                  setSelectedTitle(key); // Set the selected title
                }}
                className="click-button"
              >
                Take Quiz
              </button>
              <button
                onClick={() =>
                  navigate('/quiz-view', {
                    state: {
                      title: key, // Pass the quiz title
                      questions: quizzes[key]["questions"], // Pass the quiz questions
                      lastAccessed: quizzes[key]["lastAccessed"], // Pass the last accessed date
                    },
                  })
                }
                className="click-button"
              >
                Add Questions
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add an empty box for "Add Questions" */}
      <div
        className="quiz-box add-quiz-box"
        onClick={() => navigate('/add-questions')} // Navigate to the Add Questions route
        style={{
          cursor: 'pointer',
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Caveat',
        }}
      >
        <h3 style={{ color: '#888' }}>+ Add Quiz</h3>
      </div>
    </div>
  );
};

export default QuizBoxes;
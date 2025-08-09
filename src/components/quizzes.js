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
          onClick={() =>
            navigate('/quiz-view', {
              state: {
                title: key, // Pass the quiz title
                questions: quizzes[key]["questions"], // Pass the quiz questions
              },
            })
          } // Toggle the clicked quiz
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <h3>{key}</h3> {/* Display the key (quiz name) in each quiz box */}

          {/* Show options when the quiz box is clicked */}
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
                  navigate('/add-questions', {
                    state: {
                      title: key, // Pass the quiz title
                      questions: quizzes[key]["questions"], // Pass the quiz questions
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
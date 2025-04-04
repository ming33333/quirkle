import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizBoxes = ({ quizzes, setSelectedQuiz }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  console.log('QuizBoxes props:', JSON.stringify(quizzes), JSON.stringify(setSelectedQuiz)); // Log the props for debugging

  return (
    <div className="quiz-boxes-container">
      {/* Render quiz boxes */}
      {Object.keys(quizzes).map((key, index) => (
        <div
          key={index}
          className="quiz-box"
          onClick={() => setSelectedQuiz(quizzes[key]["questions"])} // Update the selected quiz
          style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate it's clickable
        >
          <h3>{key}</h3> {/* Display the key (quiz name) in each quiz box */}
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
        }}
      >
        <h3 style={{ color: '#888' }}>+ Add Quiz</h3>
      </div>
    </div>
  );
};

export default QuizBoxes;
import React, { useState, useEffect } from 'react';
import { updateDocument } from '../utils/firebase/firebaseServices';
import { calculateActiveQuestions } from '../utils/helpers/quizHelpers';
import QuizView from '../components/quizView';

const checkAndUpdateLevels = async (selectedQuiz, email, title) => {
  let isUpdated = false;
  try {
    const updatedQuestions = selectedQuiz.map((question) => {
      if (!question.hasOwnProperty('level')) {
        isUpdated = true;
        return { ...question, level: 1 }; // Add level property with default value 1
      }
      return question;
    });
    if (isUpdated) {
      // Update the database
      await updateDocument(`users/${email}/quizCollection/${title}`, {
        questions: updatedQuestions,
      });
      console.log('Firestore updated with level property for questions.');
    }
  } catch (error) {
    console.error('Error updating level property in Firestore:', error);
  }
};

const SpacedLearningQuiz = ({
  selectedQuiz,
  email,
  selectedTitle,
  setSelectedQuiz,
}) => {
  const [updatedQuiz, setUpdatedQuiz] = React.useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  let filteredQuestions, levelTitle;
  const [levelSelected, setLevelSelected] = React.useState(false);

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setShowAnswer(false); // Hide answer when navigating to previous question
  };

  const handleNextQuestion = () => {
    console.log('next question');
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, selectedQuiz.length - 1)
    );
    setShowAnswer(false); // Hide answer when navigating to next question
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  React.useEffect(() => {
    const updateQuiz = async () => {
      setUpdatedQuiz(selectedQuiz);
    };
    updateQuiz();
  }, [selectedQuiz, email, selectedTitle]);

  const handleBucketClick = (level, email, title) => {
    if (!selectedQuiz.SpacedLearning)
      updateDocument(`users/${email}/quizCollection/${title}`, {
        spacedLearning: 'standard',
      });

    checkAndUpdateLevels(selectedQuiz, email, selectedTitle)
    // Filter questions for the selected level
    setLevelSelected(true);
    levelTitle = `${selectedTitle} - Level ${level}`;
    if (level === 'active') {
      filteredQuestions = calculateActiveQuestions({ questions: selectedQuiz });
    } else {
      filteredQuestions = selectedQuiz.filter(
        (question) => question.level === level
      );
    }
    setUpdatedQuiz(filteredQuestions);
    console.log(`Filtered Questions for Level ${level}:`, filteredQuestions);

    // Update the quiz state with filtered questions
    setUpdatedQuiz(filteredQuestions);
  };

  if (levelSelected && updatedQuiz) {
    return (
      <QuizView
        selectedQuiz={updatedQuiz}
        selectedTitle={selectedTitle}
        currentQuestionIndex={currentQuestionIndex}
        setSelectedQuiz={setSelectedQuiz}
        handlePrevQuestion={handlePrevQuestion}
        handleNextQuestion={handleNextQuestion}
        toggleAnswerVisibility={toggleAnswerVisibility}
        showAnswer={showAnswer}
        email={email}
      />
    );
  }

  return (
    <div className="spaced-learning-container">
      <h2>Spaced Learning</h2>
      <div className="grid-container">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="bucket"
            onClick={() => handleBucketClick(level, email, selectedTitle)} // Handle bucket click
          >
            <h3>{`Level ${level}`}</h3>
          </div>
        ))}
        <div
          className="bucket"
          onClick={() => handleBucketClick('active', email, selectedTitle)} // Handle bucket click
        >
          <h3>All Active</h3>
        </div>
      </div>
    </div>
  );
};

export default SpacedLearningQuiz;

import React, { useEffect,useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB'; // Adjust the path if needed
const QuizView = ({
  selectedQuiz,
  selectedTitle,
  currentQuestionIndex,
  setSelectedQuiz,
  handlePrevQuestion,
  handleNextQuestion,
  toggleAnswerVisibility,
  showAnswer,
  email, // Pass the user's email as a prop
}) => {

  const [filterChoice, setFilterChoice] = useState(null); // Track the user's filter choice
  const handleFilterChoice = (choice) => {
    if (choice === 'passed') {
      // Filter questions that are marked as passed
      const filteredQuestions = selectedQuiz.filter((q) => q.passed === true);
      setSelectedQuiz(filteredQuestions);
    } else if (choice === 'notPassed') {
      // Filter questions that do not have a passed key or are not passed
      const filteredQuestions = selectedQuiz.filter((q) => q.passed !== true);
      setSelectedQuiz(filteredQuestions);
    } else {
      setSelectedQuiz(selectedQuiz)
    }
    setFilterChoice(choice); // Save the user's choice
  };
  const handleAnswerChoice = async (choice) => {
    try {
      const updatedQuestions = [...selectedQuiz]; // Create a copy of the questions array
      const currentQuestion = updatedQuestions[currentQuestionIndex]; // Get the current question
  
      // Add a "correct" field to the current question based on the user's choice
      currentQuestion.passed = choice === 'right';
  
      // Update the questions array in Firestore
      const quizDocRef = doc(db, 'users', email, 'quizCollection', selectedTitle);
      await updateDoc(quizDocRef, { questions: updatedQuestions });
  
      console.log(`Question updated with choice: ${choice}`);
    } catch (error) {
      console.error('Error updating question in Firestore:', error);
    }
  };
  // console.log('QuizView props:')
  const currentQuestion = selectedQuiz[currentQuestionIndex];
  const handleAwardPoint = async () => {
    try {
      const pointsDocRef = doc(db, 'users', email, 'pointSystem', 'points');
      const pointsDoc = await getDoc(pointsDocRef);

      if (pointsDoc.exists()) {
        const currentPoints = pointsDoc.data().value || 0;
        await updateDoc(pointsDocRef, { value: currentPoints + 1 }); // Increment points by 1
      } else {
        // console.log('Points document does not exist. Creating it with a value of 1...');
        await setDoc(pointsDocRef, { value: 1 }); // Create the document and set its value to 1
      }
    } catch (err) {
      console.error('Error updating points:', err);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex === selectedQuiz.length) {
      handleAwardPoint(); // Award the point when the user finishes the quiz
    }
  }, [currentQuestionIndex, selectedQuiz.length]);

  if (currentQuestionIndex === selectedQuiz.length) {
    return (
      <div className="quiz-container">
        <h2>Congrats, you are done!</h2>
        <p>You have completed the quiz and earned 1 point!</p>
        <button onClick={() => setSelectedQuiz(null)} className="question-button">
          Back to Quiz List
        </button>
      </div>
    );
  }
  // Show the filter prompt if the user hasn't made a choice yet
  if (filterChoice === null) {
    return (
      <div className="quiz-container">
        <h2>Choose Your Quiz Mode</h2>
        <p>Do you want to take only questions marked as passed or those not marked as passed?</p>
        <button onClick={() => handleFilterChoice('passed')} className="question-button">
          Passed Questions
        </button>
        <button onClick={() => handleFilterChoice('notPassed')} className="question-button">
          Not Passed Questions
        </button>
        <button onClick={() => handleFilterChoice('all')} className="question-button">
          All
        </button>
      </div>
    );
  }
  return (
    <div className="quiz-container">
      <button
        onClick={() => {
          setFilterChoice(null); // Reset filterChoice to null
          setSelectedQuiz(null); // Go back to the quiz list
        }}
        style={{ marginBottom: '1em' }}
        className="question-button"
      >
        Back to Quiz List
      </button>
      <h2>{selectedTitle}</h2> {/* Display the selected title */}
      <div className="question-navigation">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="question-button navigation-button"
        >
          &lt; Prev
        </button>
        <div className="quiz-box">
          <strong>
            Q{currentQuestionIndex + 1}/{selectedQuiz.length}:
          </strong>{' '}
          {currentQuestion.question}
          <br />
          <button onClick={toggleAnswerVisibility} className="question-button answer-toggle">
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          {showAnswer && (
            <div>
              <strong>A:</strong> {currentQuestion.answer}
              <div className="answer-buttons">
                <button onClick={() => handleAnswerChoice('right')} className="question-button right-button">
                  Right
                </button>
                <button onClick={() => handleAnswerChoice('wrong')} className="question-button wrong-button">
                  Wrong
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === selectedQuiz.length - 1}
          className="question-button navigation-button"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default QuizView;
import React, { useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseDB'; // Adjust the path if needed

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
  const currentQuestion = selectedQuiz[currentQuestionIndex];

  const handleAwardPoint = async () => {
    try {
      const pointsDocRef = doc(db, 'users', email, 'pointSystem', 'points');
      const pointsDoc = await getDoc(pointsDocRef);

      if (pointsDoc.exists()) {
        const currentPoints = pointsDoc.data().value || 0;
        await updateDoc(pointsDocRef, { value: currentPoints + 1 }); // Increment points by 1
      } else {
        console.log('Points document does not exist. Creating it with a value of 1...');
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

  return (
    <div className="quiz-container">
      <button onClick={() => setSelectedQuiz(null)} style={{ marginBottom: '1em' }} className="question-button">
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
import React, { useState, useEffect } from 'react';
import { db } from './firebaseDB';
import QuizBoxes from './quizBoxes';
import { collection, getDocs, doc } from 'firebase/firestore';

const MainContent = ({ email, selectedQuiz, setSelectedQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      console.log('Fetching quizzes...');
      try {
        const docRef = doc(db, 'users', email);
        // Reference the 'questionsCollection' subcollection
        const subcollectionRef = collection(docRef, 'quizCollection');
        const querySnapshot = await getDocs(subcollectionRef);
        console.log('QuerySnapshot:', querySnapshot);
        // Convert querySnapshot into a Map
        const quizzesData = {};
        querySnapshot.forEach((doc) => {
            quizzesData[doc.id] = doc.data();
        });
        console.log('Quizzes:', JSON.stringify(quizzesData));
        setQuizzes(quizzesData);
        setLoading(false);
        setQuizzes(quizzesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="main-content">Loading...</div>;
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setShowAnswer(false); // Hide answer when navigating to previous question
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, selectedQuiz.length - 1));
    setShowAnswer(false); // Hide answer when navigating to next question
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  if (!selectedQuiz) {
    return (
      <div className="main-content">
        <QuizBoxes quizzes={quizzes} setSelectedQuiz={setSelectedQuiz} />
      </div>
    );
  }

  console.log('Selected Quiz:', JSON.stringify(selectedQuiz)); //[{"answer":"test","question":"tes"},{"question":"test","answer":"test"}]
  const currentQuestion = selectedQuiz[currentQuestionIndex];
  return (
    <div className="main-content">
      <button onClick={() => setSelectedQuiz(null)} style={{ marginBottom: '1em' }}>
        Back to Quiz List
      </button>
      <h2>{selectedQuiz.title}</h2>
      <div className="question-navigation">
        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
          &lt; Prev
        </button>
        <div className="question">
          <strong>Q{currentQuestionIndex + 1}/{selectedQuiz.length}:</strong> {currentQuestion.question}
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
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === selectedQuiz.length - 1}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default MainContent;
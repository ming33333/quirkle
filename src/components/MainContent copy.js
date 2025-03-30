import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import QuizBoxes from './quizBoxes';
import { collection, getDocs } from 'firebase/firestore';

const MainContent = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      console.log('Fetching quizzes...');
      try {
        const collectionVal = collection(db, 'quizzes');
        const querySnapshot = await getDocs(collectionVal);
        const quizzesData = querySnapshot.docs.map(doc => doc.data());
        console.log('Quizzes:', JSON.stringify(quizzesData));
        setQuizzes(quizzesData[0]);
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
  // const selectedQuiz = quizzes[currentQuizIndex];
  // const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  // const handlePrevQuestion = () => {
  //   setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  //   setShowAnswer(false); // Hide answer when navigating to previous question
  // };

  // const handleNextQuestion = () => {
  //   setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, selectedQuiz.questions.length - 1));
  //   setShowAnswer(false); // Hide answer when navigating to next question
  // };

  // const toggleAnswerVisibility = () => {
  //   setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  // };

  return (
    <div className="main-content">
      <div>
        <QuizBoxes quizzes={quizzes} />
      </div>
    </div>
  );

//   return (
//     <div className="main-content">
//       <h2>{selectedQuiz.title}</h2>
//       <div className="question-navigation">
//         <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
//           &lt; Prev
//         </button>
//         <div className="question">
//           <strong>Q{currentQuestionIndex + 1}/{selectedQuiz.questions.length}:</strong> {currentQuestion.question}
//           <br />
//           <button onClick={toggleAnswerVisibility}>
//             {showAnswer ? 'Hide Answer' : 'Show Answer'}
//           </button>
//           {showAnswer && (
//             <div>
//               <strong>A:</strong> {currentQuestion.answer}
//             </div>
//           )}
//         </div>
//         <button onClick={handleNextQuestion} disabled={currentQuestionIndex === selectedQuiz.questions.length - 1}>
//           Next &gt;
//         </button>
//       </div>
//     </div>
//   );
};

export default MainContent;
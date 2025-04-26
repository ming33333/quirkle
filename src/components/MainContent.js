import React, { useState, useEffect } from 'react';
import { db } from './utils/firebase/firebaseDB';
import QuizBoxes from './utils/quizBoxes';
import QuizView from './pages/quizView';
import { collection, getDocs, doc } from 'firebase/firestore';

const MainContent = ({ email, selectedQuiz, setSelectedQuiz, selectedTitle,setSelectedTitle }) => {
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
        // console.log('QuerySnapshot:', querySnapshot);
        // Convert querySnapshot into a Map
        const quizzesData = {};
        querySnapshot.forEach((doc) => {
            quizzesData[doc.id] = doc.data();
        });
        // console.log('Quizzes:', JSON.stringify(quizzesData));
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
        <QuizBoxes quizzes={quizzes} setSelectedQuiz={setSelectedQuiz} setSelectedTitle={setSelectedTitle}/>
      </div>
    );
  }

  console.log(`in main content selected title: ${selectedTitle}`);

  return (
    <QuizView
      selectedQuiz={selectedQuiz}
      selectedTitle={selectedTitle}
      currentQuestionIndex={currentQuestionIndex}
      setSelectedQuiz={setSelectedQuiz}
      handlePrevQuestion={handlePrevQuestion}
      handleNextQuestion={handleNextQuestion}
      toggleAnswerVisibility={toggleAnswerVisibility}
      showAnswer={showAnswer}
    />
  );
};

export default MainContent;
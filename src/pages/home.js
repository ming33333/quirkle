import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase/firebaseDB';
import QuizBoxes from '../components/quizBoxes';
import QuizView from '../components/quizView';
import { collection, getDocs, doc } from 'firebase/firestore';
import AddQuiz from '../services/addQuiz';

const Home = ({
  email,
  selectedQuiz,
  setSelectedQuiz,
  selectedTitle,
  setSelectedTitle,
}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'spacedLearning'

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
        // Sort quizzesData by lastAccessed in descending order
        const sortedQuizzesData = Object.fromEntries(
          Object.entries(quizzesData).sort(
            ([, a], [, b]) =>
              new Date(b.lastAccessed) - new Date(a.lastAccessed)
          )
        );
        setQuizzes(sortedQuizzesData);
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
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, selectedQuiz.length - 1)
    );
    setShowAnswer(false); // Hide answer when navigating to next question
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  // if (!selectedQuiz) {
  //   return (
  //     <div className="main-content">
  //       <QuizBoxes quizzes={quizzes} setSelectedQuiz={setSelectedQuiz} setSelectedTitle={setSelectedTitle}/>
  //     </div>
  //   );

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredQuizzes =
    filter === 'all'
      ? quizzes
      : Object.fromEntries(
          Object.entries(quizzes).filter(([, quiz]) => quiz.spacedLearning)
        );
  if (!selectedQuiz) {
    return (
      <div className="main-content">
        <div className="filter-controls">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={filter === 'spacedLearning' ? 'active' : ''}
            onClick={() => handleFilterChange('spacedLearning')}
          >
            Spaced Learning
          </button>
        </div>
        <div className="main-content">
          <QuizBoxes
            quizzes={filteredQuizzes}
            setSelectedQuiz={setSelectedQuiz}
            setSelectedTitle={setSelectedTitle}
            spacedLearning={filter === 'spacedLearning'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <QuizView
        selectedQuiz={selectedQuiz}
        selectedTitle={selectedTitle}
        currentQuestionIndex={currentQuestionIndex}
        setSelectedQuiz={setSelectedQuiz}
        handlePrevQuestion={handlePrevQuestion}
        handleNextQuestion={handleNextQuestion}
        toggleAnswerVisibility={toggleAnswerVisibility}
        showAnswer={showAnswer}
        email={email}
      />

      <AddQuiz
        email={email}
        quizData={{
          title: selectedTitle,
          questions: selectedQuiz,
          lastAccessed: selectedQuiz.lastAccessed,
        }}
      />
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB';
import { useNavigate } from 'react-router-dom';


const AddQuiz = ({ email }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };
  console.log(`in add quiz current user email ${email}`)
  const handleSubmit = async () => {
    try {
      const docRef = doc(db, 'users', email);
      // Reference the 'questionsCollection' subcollection
      const subcollectionRef = collection(docRef, 'quizCollection');
      // Check if the document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        //If User (document) does not exist, create it
        console.log('User document does not exist. Creating a new user document...');
        await setDoc(docRef,{})
        // If the document does not exist, create it
        console.log('Question document does not exist. Creating a new document...');
        await setDoc(doc(subcollectionRef, title), {
          title: title,
          questions: questions
        });
      }
      const response = await setDoc(doc(subcollectionRef, title), {
        questions: questions
      });
    } catch (error) {
      console.error('Error adding field:', error);
    }
    navigate('/home'); // Redirect to the main page after submission
  };

  return (
    <div className="main-content">
      <div className="add-quiz-container">
        <h2>Add New Quiz</h2>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="quiz-input"
        />
        {questions.map((q, index) => (
          <div key={index} className="question-container">
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => handleInputChange(index, 'question', e.target.value)}
              className="quiz-input"
            />
            <input
              type="text"
              placeholder="Answer"
              value={q.answer}
              onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
              className="quiz-input"
            />
          </div>
        ))}
        <button onClick={handleAddQuestion} className="quiz-button add-question-button">
          Add Another Question
        </button>
        <button onClick={handleSubmit} className="quiz-button submit-button">
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default AddQuiz;
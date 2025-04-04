import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseDB';
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

  const handleSubmit = async () => {
    console.log(JSON.stringify({ title, questions })); 
    try {
      const docRef = doc(db, 'users', email);
      // Reference the 'questionsCollection' subcollection
      const subcollectionRef = collection(docRef, 'quizCollection');
      // Check if the document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        // If the document does not exist, create it
        console.log('Document does not exist. Creating a new document...');
        await setDoc(doc(subcollectionRef, title), {
          title: title,
          questions: questions
        });
      }
      const response = await setDoc(doc(subcollectionRef, title), {
        questions: questions
      });
      console.log('response', response);
      console.log('Field added successfully!');
    } catch (error) {
      console.error('Error adding field:', error);
    }
    navigate('/'); // Redirect to the main page after submission
  };

  return (
    <div>
      <h2>Add New Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((q, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => handleInputChange(index, 'question', e.target.value)}
          />
          <input
            type="text"
            placeholder="Answer"
            value={q.answer}
            onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddQuestion}>Add Another Question</button>
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default AddQuiz;
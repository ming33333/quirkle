import React, { useState } from 'react';
import { collection, getDoc, setDoc, doc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase/firebaseDB';
import { useNavigate } from 'react-router-dom';

const AddQuiz = ({ email }) => {

  const location = useLocation();
  const initialData = location.state || {}; // Retrieve initialData from the state
  console.log(`initialData`, initialData);
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [title, setTitle] = useState(initialData?.title || ''); // Prefill title if provided
  const [questions, setQuestions] = useState(initialData?.questions || [{ question: '', answer: '' }]); // Prefill questions if provided
  const [bulkInput, setBulkInput] = useState(''); // State for bulk input

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index); // Remove the question at the specified index
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      const docRef = doc(db, 'users', email);
      // Reference the 'quizCollection' subcollection
      const subcollectionRef = collection(docRef, 'quizCollection');

      // Check if the user document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log('User document does not exist. Creating a new user document...');
        await setDoc(docRef, {}); // Create the user document if it doesn't exist
      }

      // Add or update the quiz document in the 'quizCollection' subcollection
      await setDoc(doc(subcollectionRef, title), {
        title: title,
        questions: questions,
      });

      console.log('Quiz added/updated successfully!');
    } catch (error) {
      console.error('Error adding/updating quiz:', error);
    }

    navigate('/home'); // Redirect to the main page after submission
  };
  const handleBulkAdd = () => {
    const newQuestions = bulkInput
      .split('\n') // Split by new lines
      .map((line) => line.split('\t')) // Split each line by tabs (for two columns)
      .filter((cols) => cols.length === 2) // Ensure each line has exactly 2 columns
      .map(([question, answer]) => ({ question: question.trim(), answer: answer.trim() })); // Map to question/answer objects

    setQuestions([...questions, ...newQuestions]); // Add new questions to the existing list
    setBulkInput(''); // Clear the bulk input field
  };

  return (
    <div className="main-content">
      <div className="add-quiz-container">
        <h2>{initialData ? 'Edit Quiz' : 'Add New Quiz'}</h2>
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
            <button onClick={() => handleRemoveQuestion(index)} className="remove-button">
              Remove
            </button>
          </div>
        ))}

        <textarea
          placeholder="Paste questions and answers here (tab-separated, one per line)"
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          className="bulk-input"
        />
        <button onClick={handleBulkAdd} className="quiz-button bulk-add-button">
          Add Bulk Questions
        </button>
        <button onClick={handleAddQuestion} className="quiz-button add-question-button">
          Add Another Question
        </button>
        <button onClick={handleSubmit} className="quiz-button submit-button">
          {initialData ? 'Update Quiz' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default AddQuiz;
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  and,
} from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { db } from '../utils/firebase/firebaseDB';
import { useNavigate } from 'react-router-dom';
import { updateDocument } from '../utils/firebase/firebaseServices';

const AddQuiz = ({ email, quizData }) => {
  const location = useLocation();
  const [initialDataEmpty, setInitialDataEmpty] = useState(false);
  const initialData = quizData || {}; // Retrieve initialData from the state

  if (Object.keys(initialData).length <= 0 && !initialDataEmpty) {
    console.log(`Initial data is empty.`);
    setInitialDataEmpty(true);
  }
  if (!initialDataEmpty && initialData?.title) {
    if (initialData?.lastAccessed) {
      updateDocument(`users/${email}/quizCollection/${initialData.title}`, {
        lastAccessed: new Date().toISOString(),
      });
    } else {
      updateDocument(`users/${email}/quizCollection/${initialData.title}`, {
        lastAccessed: new Date().toISOString(),
      });
    }
  }
  const handleAutoUpdate = async (index) => {
    try {
      const updatedQuestions = [...questions]; // Create a copy of the questions array
      const quizDocRef = doc(db, 'users', email, 'quizCollection', title); // Reference to the quiz document

      // Update the database with the modified questions array
      await updateDocument(
        `users/${email}/quizCollection/${initialData.title}`,
        { lastAccessed: new Date().toISOString() }
      );

      console.log(`Question ${index + 1} updated successfully.`);
    } catch (error) {
      console.error('Error updating question in Firestore:', error);
    }
  };
  const handleToggleStar = async (index) => {
    try {
      const updatedQuestions = [...questions]; // Create a copy of the questions array
      updatedQuestions[index].starred = !updatedQuestions[index].starred; // Toggle the star status
      setQuestions(updatedQuestions); // Update the state

      // Update the database
      await updateDocument(`users/${email}/quizCollection/${title}`, {
        questions: updatedQuestions,
      });
    } catch (error) {
      console.error('Error updating star status in Firestore:', error);
    }
  };
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [title, setTitle] = useState(initialData?.title || ''); // Prefill title if provided
  const [questions, setQuestions] = useState(
    initialData?.questions || [{ question: '', answer: '' }]
  ); // Prefill questions if provided
  const [bulkInput, setBulkInput] = useState(''); // State for bulk input
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    // Adjust the height of all textareas based on their content
    const textareas = document.querySelectorAll('.quiz-textarea');
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
    });
  }, [questions]); // Run whenever questions change

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    console.log(
      `Updated question at index total ${index} ${JSON.stringify(updatedQuestions)}:`
    );
    setQuestions(updatedQuestions);
  };
  const handleAddQuestionBelow = (index) => {
    const newQuestion = { question: '', answer: '' }; // Create a new empty question
    const updatedQuestions = [
      ...questions.slice(0, index + 1), // Keep all questions up to the current index
      newQuestion, // Insert the new question
      ...questions.slice(index + 1), // Keep all questions after the current index
    ];
    setQuestions(updatedQuestions); // Update the state
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index); // Remove the question at the specified index
    setQuestions(updatedQuestions);
  };
  const handleDeleteQuiz = async () => {
    try {
      const quizRef = doc(db, 'users', email, 'quizCollection', title); // Reference the quiz document
      await deleteDoc(quizRef); // Delete the quiz document
      // console.log(`Quiz "${title}" deleted successfully!`);
      setTitle(''); // Clear the title
      setQuestions([]); // Clear the questions
      setShowDeletePopup(false); // Hide the popup
    } catch (err) {
      console.error('Error deleting quiz:', err);
    }
  };

  const confirmDeleteQuiz = () => {
    setShowDeletePopup(true); // Show the confirmation popup
  };

  const cancelDeleteQuiz = () => {
    setShowDeletePopup(false); // Hide the confirmation popup
  };

  const handleSubmit = async () => {
    try {
      const docRef = doc(db, 'users', email);
      // Reference the 'quizCollection' subcollection
      const subcollectionRef = collection(docRef, 'quizCollection');

      // Check if the user document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log(
          'User document does not exist. Creating a new user document...'
        );
        await setDoc(docRef, {}); // Create the user document if it doesn't exist
      }
      console.log('User document exists or created successfully!');
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
      .map(([question, answer]) => ({
        question: question.trim(),
        answer: answer.trim(),
      })); // Map to question/answer objects

    setQuestions([...questions, ...newQuestions]); // Add new questions to the existing list
    setBulkInput(''); // Clear the bulk input field
  };

  return (
    <div className="main-content">
      <div className="add-quiz-container">
        <h2>{initialData ? 'Edit Quiz' : 'Add New Quiz'}</h2>
        {!initialDataEmpty && (
          <div className="button-group">
            <button onClick={confirmDeleteQuiz} className="delete-quiz-button">
              Delete Quiz
            </button>
            <button
              onClick={() =>
                navigate('/spaced-learning', {
                  state: { initialData, email, title }, // Pass initialData to /spaced-learning
                })
              }
              className="spaced-learning-button"
            >
              Spaced Learning
            </button>
          </div>
        )}
        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Are you sure you want to delete the quiz "{title}"?</h3>
              <button
                onClick={handleDeleteQuiz}
                className="confirm-delete-button"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDeleteQuiz}
                className="cancel-delete-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="quiz-input"
        />
        {questions.map((q, index) => (
          <div key={index} className="question-container">
            <div className="qa-fields">
              <div className="question-labels">
                <label className="question-number">
                  Q{index + 1}: {q.starred ? '★' : '☆'}{' '}
                  {/* Display star icon */}
                </label>
                <label className="question-pass">
                  {q.passed ? 'Passed' : 'Not Passed'}
                </label>
              </div>
              <textarea
                placeholder="Question"
                value={q.question}
                onChange={(e) =>
                  handleInputChange(index, 'question', e.target.value)
                }
                onBlur={() => handleAutoUpdate(index)} // Trigger auto-update on blur
                className="quiz-textarea"
              />
              <textarea
                placeholder="Answer"
                value={q.answer}
                onChange={(e) =>
                  handleInputChange(index, 'answer', e.target.value)
                }
                onBlur={() => handleAutoUpdate(index)} // Trigger auto-update on blur
                className="quiz-textarea"
              />
            </div>
            <div className="options-menu">
              <button
                className="options-button"
                onClick={() => {
                  const menu = document.getElementById(`menu-${index}`);
                  menu.style.display =
                    menu.style.display === 'block' ? 'none' : 'block';
                }}
              >
                ⋮
              </button>
              <div id={`menu-${index}`} className="options-dropdown">
                <button
                  onClick={() => handleRemoveQuestion(index)}
                  className="remove-button"
                >
                  Remove Question
                </button>
                <button
                  onClick={() => handleAddQuestionBelow(index)}
                  className="add-button"
                >
                  Add Question Below
                </button>
                <button
                  onClick={() => handleToggleStar(index)}
                  className="star-button"
                >
                  {q.starred ? 'Unstar Question' : 'Star Question'}
                </button>
              </div>
            </div>
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
        {initialDataEmpty && (
          <button onClick={handleSubmit} className="quiz-button submit-button">
            {'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddQuiz;

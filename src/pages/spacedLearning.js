import React from 'react';
import { updateDocument } from '../utils/firebase/firebaseServices';

// const handleToggleStar = async (index) => {
//   try {
//     const updatedQuestions = [...questions]; // Create a copy of the questions array
//     updatedQuestions[index].starred = !updatedQuestions[index].starred; // Toggle the star status
//     setQuestions(updatedQuestions); // Update the state

//     // Update the database
//     await updateDocument(`users/${email}/quizCollection/${title}`, {
//       questions: updatedQuestions,
//     });
//   } catch (error) {
//     console.error('Error updating star status in Firestore:', error);
//   }
// };
const checkAndUpdateLevels = async (selectedQuiz,email,title) => {
  let isUpdated = false;
  try {
    const updatedQuestions = selectedQuiz.map((question) => {
      if (!question.hasOwnProperty('level')) {
        isUpdated = true;
        return { ...question, level: 1 }; // Add level property with default value 1
        
      }
      return question;
    });
    console.log('Updated Questions:', updatedQuestions);
    if (isUpdated) {
      // Update the database
      await updateDocument(`users/${email}/quizCollection/${title}`, {
        questions: updatedQuestions,
      });
      console.log('Firestore updated with level property for questions.');
    }
  } catch (error) {
    console.error('Error updating level property in Firestore:', error);
  }
};

const SpacedLearning = ({ selectedQuiz, email, selectedTitle }) => {
  checkAndUpdateLevels(selectedQuiz,email,selectedTitle);

  return (
    <div className="spaced-learning-container">
      <h2>Spaced Learning</h2>
      <div className="grid-container">
        {[1, 2, 3, 4].map((level) => (
          <div key={level} className="bucket">
            <h3>{`Level ${level}`}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacedLearning;
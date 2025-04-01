import React, { useState } from 'react';
import { collection, addDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const AddQuestions = () => {
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
    const docRef = doc(db,'quizzes','mintharuck');
    console.log(JSON.stringify(docRef));
    // Reference a subcollection under the 'React' document
    const subcollectionRef = doc(collection(docRef, "questions"),title);
    let response;
    // Add each question to the 'questions' subcollection
    for (const question of questions) {
      const response = await addDoc(subcollectionRef, question);
      console.log(`title: ${title}`);
      console.log('Added question with ID:', response.id);
    }
    console.log(JSON.stringify(response));
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

export default AddQuestions;
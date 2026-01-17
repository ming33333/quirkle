import React, { useState, useEffect } from "react";
import { updateDocument } from "../utils/firebase/firebaseServices";
import { calculateActiveQuestions } from "../utils/helpers/quizHelpers";
import QuizView from "../components/quizView";

const checkAndUpdateLevels = async (selectedQuiz, email, title) => {
  try {
    // Convert questions from map to array, preserving original map keys as originalIndex
    let questionsArray;
    if (Array.isArray(selectedQuiz)) {
      // If already an array, preserve existing originalIndex or add it
      questionsArray = selectedQuiz.map((question, index) => ({
        ...question,
        originalIndex:
          question.originalIndex !== undefined
            ? question.originalIndex
            : String(index),
      }));
    } else {
      // If it's a map, preserve the original keys
      questionsArray = Object.entries(selectedQuiz || {}).map(
        ([key, question]) => ({
          ...question,
          originalIndex:
            question.originalIndex !== undefined
              ? question.originalIndex
              : String(key),
        })
      );
    }

    // Build update object with only questions that need level property added
    const updateData = {};
    let hasUpdates = false;

    questionsArray.forEach((question, arrayIndex) => {
      if (!question.hasOwnProperty("level")) {
        // Use originalIndex if available, otherwise fall back to array index
        const questionIndex =
          question.originalIndex !== undefined
            ? String(question.originalIndex)
            : String(arrayIndex);
        updateData[`questions.${questionIndex}.level`] = 1; // Add level property with default value 1
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      // Update only the specific questions that need the level property
      await updateDocument(
        `users/${email}/quizCollection/${title}`,
        updateData
      );
      console.log("Firestore updated with level property for questions.");
    }
  } catch (error) {
    console.error("Error updating level property in Firestore:", error);
  }
};

const SpacedLearningQuiz = ({
  selectedQuiz,
  email,
  selectedTitle,
  setSelectedQuiz,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  handlePrevQuestion,
  handleNextQuestion,
  toggleAnswerVisibility,
  showAnswer,
}) => {
  const [updatedQuiz, setUpdatedQuiz] = React.useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [localCurrentQuestionIndex, setLocalCurrentQuestionIndex] = useState(0);
  const [localShowAnswer, setLocalShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  let filteredQuestions, levelTitle;
  const [levelSelected, setLevelSelected] = React.useState(false);

  // Use passed handlers if available, otherwise use local state
  const effectiveCurrentQuestionIndex =
    currentQuestionIndex !== undefined
      ? currentQuestionIndex
      : localCurrentQuestionIndex;
  const effectiveSetCurrentQuestionIndex =
    setCurrentQuestionIndex || setLocalCurrentQuestionIndex;
  const effectiveShowAnswer =
    showAnswer !== undefined ? showAnswer : localShowAnswer;

  const localHandlePrevQuestion =
    handlePrevQuestion ||
    (() => {
      effectiveSetCurrentQuestionIndex((prevIndex) =>
        Math.max(prevIndex - 1, 0)
      );
      if (!showAnswer) setLocalShowAnswer(false);
    });

  const localHandleNextQuestion =
    handleNextQuestion ||
    (() => {
      const questionsArray = Array.isArray(updatedQuiz)
        ? updatedQuiz
        : Object.values(updatedQuiz || {});
      effectiveSetCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, questionsArray.length - 1)
      );
      if (!showAnswer) setLocalShowAnswer(false);
    });

  const localToggleAnswerVisibility =
    toggleAnswerVisibility ||
    (() => {
      setLocalShowAnswer((prev) => !prev);
    });

  React.useEffect(() => {
    const updateQuiz = async () => {
      // Convert questions from map to array, preserving original map keys as originalIndex
      let questionsArray;
      if (Array.isArray(selectedQuiz)) {
        questionsArray = selectedQuiz.map((question, index) => ({
          ...question,
          originalIndex:
            question.originalIndex !== undefined
              ? question.originalIndex
              : String(index),
        }));
      } else {
        // If it's a map, preserve the original keys
        questionsArray = Object.entries(selectedQuiz || {}).map(
          ([key, question]) => ({
            ...question,
            originalIndex:
              question.originalIndex !== undefined
                ? question.originalIndex
                : String(key),
          })
        );
      }
      setUpdatedQuiz(questionsArray);
    };
    updateQuiz();
  }, [selectedQuiz, email, selectedTitle]);

  const handleBucketClick = (level, email, title) => {
    // Convert questions from map to array, preserving original map keys as originalIndex
    let questionsArray;
    if (Array.isArray(selectedQuiz)) {
      questionsArray = selectedQuiz.map((question, index) => ({
        ...question,
        originalIndex:
          question.originalIndex !== undefined
            ? question.originalIndex
            : String(index),
      }));
    } else {
      // If it's a map, preserve the original keys
      questionsArray = Object.entries(selectedQuiz || {}).map(
        ([key, question]) => ({
          ...question,
          originalIndex:
            question.originalIndex !== undefined
              ? question.originalIndex
              : String(key),
        })
      );
    }
    if (!selectedQuiz.SpacedLearning)
      updateDocument(`users/${email}/quizCollection/${title}`, {
        spacedLearning: "standard",
      });

    checkAndUpdateLevels(questionsArray, email, selectedTitle);
    // Filter questions for the selected level
    setLevelSelected(true);
    levelTitle = `${selectedTitle} - Level ${level}`;
    if (level === "active") {
      filteredQuestions = calculateActiveQuestions({
        questions: questionsArray,
      });
    } else {
      filteredQuestions = questionsArray.filter(
        (question) => question.level === level
      );
    }
    setUpdatedQuiz(filteredQuestions);
    console.log(`Filtered Questions for Level ${level}:`, filteredQuestions);

    // Update the quiz state with filtered questions
    setUpdatedQuiz(filteredQuestions);
  };

  if (levelSelected && updatedQuiz) {
    return (
      <QuizView
        selectedQuiz={updatedQuiz}
        selectedTitle={selectedTitle}
        currentQuestionIndex={effectiveCurrentQuestionIndex}
        setCurrentQuestionIndex={effectiveSetCurrentQuestionIndex}
        setSelectedQuiz={setSelectedQuiz}
        handlePrevQuestion={localHandlePrevQuestion}
        handleNextQuestion={localHandleNextQuestion}
        toggleAnswerVisibility={localToggleAnswerVisibility}
        showAnswer={effectiveShowAnswer}
        email={email}
      />
    );
  }

  return (
    <div className="spaced-learning-container">
      <h2>Spaced Learning</h2>
      <div className="grid-container">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="bucket"
            onClick={() => handleBucketClick(level, email, selectedTitle)} // Handle bucket click
          >
            <h3>{`Level ${level}`}</h3>
          </div>
        ))}
        <div
          className="bucket"
          onClick={() => handleBucketClick("active", email, selectedTitle)} // Handle bucket click
        >
          <h3>All Active</h3>
        </div>
      </div>
    </div>
  );
};

export default SpacedLearningQuiz;

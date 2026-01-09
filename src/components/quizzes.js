import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateActiveQuestions } from "../utils/helpers/quizHelpers";

const QuizBoxes = ({
  quizzes,
  setSelectedQuiz,
  setSelectedTitle,
  spacedLearning = false,
}) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [clickedQuiz, setClickedQuiz] = useState(null); // Track which quiz box is clicked
  const [showTooltip, setShowTooltip] = useState(null); // Track which tooltip is visible

  const calculateDaysAgo = (lastAccessed) => {
    const lastAccessedDate = new Date(lastAccessed);
    const currentDate = new Date();
    const timeDifference = currentDate - lastAccessedDate; // Difference in milliseconds
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days
    return daysAgo;
  };

  const calculateQuizLevels = (quiz) => {
    // Convert questions map to array if needed
    const questionsArray = Array.isArray(quiz.questions)
      ? quiz.questions
      : Object.values(quiz.questions || {});

    const levels = {};
    questionsArray.forEach((question) => {
      const level = parseInt(question.level, 10) || 1; // Default to level 1 if no level or invalid
      levels[level] = (levels[level] || 0) + 1; // Count questions per level
    });
    return JSON.stringify(levels);
  };

  return (
    <div className="quiz-boxes-container">
      {/* Render quiz boxes */}
      {spacedLearning && (
        <div
          className="quiz-option" // Use the same class as other quiz boxes
          style={{
            cursor: "default",
            backgroundColor: "#d3f9d8", // Optional: Keep the unique background color
          }}
        >
          {/* TODO add in cumulative test view inthe isbox*/}
          <h3 style={{ color: "#4caf50" }}>Hello</h3>
        </div>
      )}
      {Object.keys(quizzes).map((key, index) => (
        <div
          key={index}
          className="quiz-option"
          onClick={() => {
            // Convert questions map to array if needed, preserving original map keys
            const questions = quizzes[key]["questions"];
            let questionsArray;
            if (Array.isArray(questions)) {
              questionsArray = questions.map((q, idx) => ({
                ...q,
                originalIndex:
                  q.originalIndex !== undefined ? q.originalIndex : String(idx),
              }));
            } else {
              // Preserve original map keys as originalIndex
              questionsArray = Object.entries(questions || {}).map(
                ([key, q]) => ({
                  ...q,
                  originalIndex:
                    q.originalIndex !== undefined
                      ? q.originalIndex
                      : String(key),
                })
              );
            }
            setSelectedQuiz(questionsArray); // Set the selected quiz
            setSelectedTitle(key); // Set the selected title
          }}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <div className="quiz-header">
            <h3>{key}</h3> {/* Display the key (quiz name) */}
            <span
              className="last-accessed"
              onMouseEnter={() => setShowTooltip(key)} // Show tooltip on hover
              onMouseLeave={() => setShowTooltip(null)} // Hide tooltip when hover ends
              onClick={(event) => {
                event.stopPropagation(); // Prevent the click event from propagating to the parent
                setShowTooltip((prev) => (prev === key ? null : key)); // Toggle tooltip on click
              }}
            >
              {quizzes[key]["lastAccessed"]
                ? `${calculateDaysAgo(quizzes[key]["lastAccessed"])} days ago`
                : "Never Accessed"}
              <br /> {/* Added line break */}
              {`Levels: ${calculateQuizLevels(quizzes[key])}`}
              <br /> {/* Added line break */}
              {`Active Questions: ${calculateActiveQuestions(quizzes[key]).length}/${
                Array.isArray(quizzes[key]["questions"])
                  ? quizzes[key]["questions"].length
                  : Object.keys(quizzes[key]["questions"] || {}).length
              }`}
              {showTooltip === key && (
                <div className="tooltip">
                  {quizzes[key]["lastAccessed"]
                    ? new Date(quizzes[key]["lastAccessed"]).toLocaleString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "No access date available"}
                </div>
              )}
            </span>
          </div>
          {clickedQuiz === key && (
            <div className="click-options">
              <button
                onClick={() => {
                  // Convert questions map to array if needed, preserving original map keys
                  const questions = quizzes[key]["questions"];
                  let questionsArray;
                  if (Array.isArray(questions)) {
                    questionsArray = questions.map((q, idx) => ({
                      ...q,
                      originalIndex:
                        q.originalIndex !== undefined
                          ? q.originalIndex
                          : String(idx),
                    }));
                  } else {
                    // Preserve original map keys as originalIndex
                    questionsArray = Object.entries(questions || {}).map(
                      ([key, q]) => ({
                        ...q,
                        originalIndex:
                          q.originalIndex !== undefined
                            ? q.originalIndex
                            : String(key),
                      })
                    );
                  }
                  setSelectedQuiz(questionsArray); // Set the selected quiz
                  setSelectedTitle(key); // Set the selected title
                }}
                className="click-button"
              >
                Take Quiz
              </button>
              <button
                onClick={() => {
                  // Convert questions map to array if needed, preserving original map keys
                  const questions = quizzes[key]["questions"];
                  let questionsArray;
                  if (Array.isArray(questions)) {
                    questionsArray = questions.map((q, idx) => ({
                      ...q,
                      originalIndex:
                        q.originalIndex !== undefined
                          ? q.originalIndex
                          : String(idx),
                    }));
                  } else {
                    // Preserve original map keys as originalIndex
                    questionsArray = Object.entries(questions || {}).map(
                      ([key, q]) => ({
                        ...q,
                        originalIndex:
                          q.originalIndex !== undefined
                            ? q.originalIndex
                            : String(key),
                      })
                    );
                  }
                  navigate("/quiz-view", {
                    state: {
                      title: key, // Pass the quiz title
                      questions: questionsArray, // Pass the quiz questions as array
                      lastAccessed: quizzes[key]["lastAccessed"], // Pass the last accessed date
                    },
                  });
                }}
                className="click-button"
              >
                Add Questions
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add an empty box for "Add Questions" */}
      <div
        className="quiz-box add-quiz-box"
        onClick={() => navigate("/add-questions")} // Navigate to the Add Questions route
        style={{
          cursor: "pointer",
          backgroundColor: "#f0f0f0",
          border: "2px dashed #ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Caveat",
        }}
      >
        <h3 style={{ color: "#888" }}>+ Add Quiz</h3>
      </div>
    </div>
  );
};

export default QuizBoxes;

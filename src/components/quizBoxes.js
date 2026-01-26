import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateActiveQuestions } from "../utils/helpers/quizHelpers";

const QuizBoxes = ({
  quizzes,
  setSelectedQuiz,
  setSelectedTitle,
  spacedLearning = "all",
  isFreePlan = false,
  maxReachedFree = false,
  freePlanMax = 10,
}) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [clickedQuiz, setClickedQuiz] = useState(null); // Track which quiz box is clicked
  const [showTooltip, setShowTooltip] = useState(null); // Track which tooltip is visible - format: "quizKey-tooltipType" or null

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

  const formatQuizLevels = (quiz) => {
    // Convert questions map to array if needed
    const questionsArray = Array.isArray(quiz.questions)
      ? quiz.questions
      : Object.values(quiz.questions || {});

    const levels = {};
    questionsArray.forEach((question) => {
      const level = parseInt(question.level, 10) || 1; // Default to level 1 if no level or invalid
      levels[level] = (levels[level] || 0) + 1; // Count questions per level
    });

    // Format as readable string
    const levelEntries = Object.entries(levels)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([level, count]) => `L${level}:T${count}`)
      .join(", ");

    return levelEntries || "No questions";
  };
  const formatQuizLevelsExtended = (quiz) => {
    // Convert questions map to array if needed
    const questionsArray = Array.isArray(quiz.questions)
      ? quiz.questions
      : Object.values(quiz.questions || {});

    const levels = {};
    questionsArray.forEach((question) => {
      const level = parseInt(question.level, 10) || 1; // Default to level 1 if no level or invalid
      levels[level] = (levels[level] || 0) + 1; // Count questions per level
    });

    // Format as readable string
    const levelEntries = Object.entries(levels)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([level, count]) => `Level ${level}: ${count} questions`)
      .join(", ");

    return levelEntries || "No questions";
  };

  // Normalize spacedLearning prop to handle both boolean and string values
  const isSpacedLearningView =
    spacedLearning === "spacedLearning" || spacedLearning === true;

  // Calculate totals for tracker box (all view)
  const calculateTotals = () => {
    let totalQuizzes = 0;
    let totalQuestions = 0;
    
    Object.keys(quizzes).forEach((key) => {
      const quiz = quizzes[key];
      totalQuizzes++;
      const questions = Array.isArray(quiz.questions)
        ? quiz.questions
        : Object.values(quiz.questions || {});
      totalQuestions += questions.length;
    });
    
    return { totalQuizzes, totalQuestions };
  };

  const { totalQuizzes, totalQuestions } = calculateTotals();
  const [showSpacedLearningModal, setShowSpacedLearningModal] = useState(false);

  return (
    <div className="quiz-boxes-container">
      {/* Tracker Box for "all" view */}
      {!isSpacedLearningView && (
        <div
          className="quiz-option"
          style={{
            cursor: "default",
            border: "2px solid #4CAF50",
          }}
        >
          <h3 style={{ color: "#4CAF50", marginBottom: "12px", fontSize: "1.2em", textAlign: "center", width: "100%", margin: "0 0 12px 0" }}>
            📊 Quiz Tracker
          </h3>
          {totalQuizzes === 0 || totalQuestions === 0 ? (
            <p style={{ color: "#666", fontSize: "0.95em", textAlign: "center", margin: 0, width: "100%" }}>
              Let's start adding some quizzes!!
            </p>
          ) : (
            <div style={{ textAlign: "center", color: "#333", width: "100%" }}>
              <p style={{ margin: "0", fontSize: "1em", textAlign: "center", width: "100%" }}>
                <strong>Total Quizzes:</strong> {totalQuizzes}
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "1em", textAlign: "center", width: "100%" }}>
                <strong>Total Questions:</strong> {totalQuestions}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Box for "spacedLearning" view */}
      {isSpacedLearningView && (
        <>
          <div
            className="quiz-option"
            onClick={() => setShowSpacedLearningModal(true)}
            style={{
              backgroundColor: "#E3F2FD",
              border: "2px solid #2196F3",
              cursor: "pointer",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#BBDEFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E3F2FD";
            }}
          >
            <h3 style={{ color: "#2196F3", marginBottom: "8px", fontSize: "1.2em", textAlign: "left", width: "100%", margin: "0 0 8px 0" }}>
              ℹ️ Learn about Spaced Learning
            </h3>
            <p style={{ color: "#1976D2", fontSize: "0.9em", margin: 0, textAlign: "left", width: "100%" }}>
              Click to learn how spaced learning works
            </p>
          </div>

          {/* Spaced Learning Modal */}
          {showSpacedLearningModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
              onClick={() => setShowSpacedLearningModal(false)}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "30px",
                  maxWidth: "600px",
                  maxHeight: "80vh",
                  overflow: "auto",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowSpacedLearningModal(false)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666",
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
                <h2 style={{ color: "#2196F3", marginTop: 0, marginBottom: "20px" }}>
                  What is Spaced Learning?
                </h2>
                <div style={{ color: "#333", lineHeight: "1.6" }}>
                  <p style={{ marginBottom: "15px" }}>
                    Spaced Learning is a scientifically-proven learning technique that helps you
                    retain information more effectively by reviewing material at increasing intervals.
                  </p>
                  <h3 style={{ color: "#1976D2", marginTop: "20px", marginBottom: "10px" }}>
                    How It Works:
                  </h3>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Level 1:</strong> Questions you answer correctly move to Level 2, 
                      and you'll see them again soon.
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Level 2:</strong> Correct answers advance to Level 3, with longer 
                      intervals between reviews.
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Level 3:</strong> Questions here are reviewed less frequently, 
                      helping solidify your memory.
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Level 4:</strong> Mastered questions! These are reviewed very 
                      infrequently, as you've demonstrated strong retention.
                    </li>
                  </ul>
                  <p style={{ marginTop: "20px", fontStyle: "italic", color: "#666" }}>
                    The system automatically schedules questions based on your performance, 
                    ensuring you review material at optimal intervals for long-term retention.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* Render quiz boxes */}
      {isSpacedLearningView &&
        (() => {
          // Get all spaced learning quizzes with their active questions (sequential structure)
          const getCumulativeTestQuizzes = () => {
            const quizList = [];
            Object.keys(quizzes).forEach((quizKey) => {
              const quiz = quizzes[quizKey];
              if (quiz.spacedLearning) {
                const questions = Array.isArray(quiz.questions)
                  ? quiz.questions
                  : Object.values(quiz.questions || {});

                // Get active questions using calculateActiveQuestions helper
                const activeQuestions = calculateActiveQuestions(quiz);

                if (activeQuestions.length > 0) {
                  // Preserve originalIndex for each question
                  const questionsWithIndex = activeQuestions.map((question) => {
                    const originalIdx = questions.findIndex(
                      (q) => q === question
                    );
                    return {
                      ...question,
                      originalIndex:
                        question.originalIndex !== undefined
                          ? question.originalIndex
                          : String(
                              originalIdx >= 0
                                ? originalIdx
                                : questions.indexOf(question)
                            ),
                    };
                  });

                  quizList.push({
                    title: quizKey,
                    questions: questionsWithIndex,
                    lastAccessed: quiz.lastAccessed,
                    spacedLearning: quiz.spacedLearning,
                  });
                }
              }
            });
            return quizList;
          };

          const cumulativeQuizList = getCumulativeTestQuizzes();
          const totalQuestions = cumulativeQuizList.reduce(
            (sum, quiz) => sum + quiz.questions.length,
            0
          );

          // return (
          //   <div
          //     className="quiz-option"
          //     style={{
          //       cursor: "pointer",
          //       backgroundColor: "#d3f9d8",
          //       transition: "transform 0.2s ease",
          //     }}
          //     onMouseEnter={(e) => {
          //       e.currentTarget.style.transform = "scale(1.02)";
          //     }}
          //     onMouseLeave={(e) => {
          //       e.currentTarget.style.transform = "scale(1)";
          //     }}
          //     onClick={() => {
          //       if (cumulativeQuizList.length > 0) {
          //         // Set cumulative test data with sequential quiz structure
          //         setSelectedQuiz({
          //           quizList: cumulativeQuizList, // Array of quiz objects
          //           currentQuizIndex: 0, // Start with first quiz
          //           lastAccessed: null,
          //           spacedLearning: "cumulative",
          //           isCumulativeTest: true,
          //           questions: cumulativeQuizList[0].questions, // Start with first quiz's questions
          //           currentQuizTitle: cumulativeQuizList[0].title, // Current quiz being taken
          //         });
          //         setSelectedTitle("Cumulative Test");
          //       } else {
          //         alert(
          //           "No active questions found in spaced learning quizzes!"
          //         );
          //       }
          //     }}
          //   >
          //     <h3 style={{ color: "#4caf50", marginBottom: "8px" }}>
          //       Cumulative Test
          //     </h3>
          //     <p style={{ color: "#2e7d32", fontSize: "0.9em", margin: 0 }}>
          //       {totalQuestions > 0
          //         ? `${totalQuestions} active question${totalQuestions !== 1 ? "s" : ""} across ${cumulativeQuizList.length} quiz${cumulativeQuizList.length !== 1 ? "zes" : ""}`
          //         : "No active questions"}
          //     </p>
          //   </div>
          // );
        })()}
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
            // Set the full quiz object with questions and metadata
            setSelectedQuiz({
              questions: questionsArray,
              lastAccessed: quizzes[key]["lastAccessed"],
              spacedLearning: quizzes[key]["spacedLearning"],
              ...Object.fromEntries(
                Object.entries(quizzes[key]).filter(([k]) => k !== "questions")
              ),
            });
            setSelectedTitle(key); // Set the selected title
          }}
          style={{
            position: "relative",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="quiz-header">
            {/* Stats in top left corner */}
            <div
              className="quiz-stats"
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                fontSize: "0.75em",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                lineHeight: "1.2",
              }}
            >
              {/* Days Ago Tooltip */}
              <span
                className="stat-item"
                style={{ position: "relative", cursor: "pointer" }}
                onMouseEnter={() => setShowTooltip(`${key}-daysAgo`)}
                onMouseLeave={() => setShowTooltip(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowTooltip((prev) =>
                    prev === `${key}-daysAgo` ? null : `${key}-daysAgo`
                  );
                }}
              >
                {quizzes[key]["lastAccessed"]
                  ? `${calculateDaysAgo(quizzes[key]["lastAccessed"])} days ago`
                  : "Never Accessed"}
                {showTooltip === `${key}-daysAgo` && (
                  <div className="tooltip">
                    {quizzes[key]["lastAccessed"]
                      ? (() => {
                          const date = new Date(quizzes[key]["lastAccessed"]);
                          const timeStr = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          const dateStr = date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                          return `Time Last Accessed: ${timeStr} - ${dateStr}`;
                        })()
                      : "No access date available"}
                  </div>
                )}
              </span>

              {/* Questions Progress Tooltip */}
              <span
                className="stat-item"
                style={{ position: "relative", cursor: "pointer" }}
                onMouseEnter={() => setShowTooltip(`${key}-progress`)}
                onMouseLeave={() => setShowTooltip(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowTooltip((prev) =>
                    prev === `${key}-progress` ? null : `${key}-progress`
                  );
                }}
              >
                {`Progress: ${formatQuizLevels(quizzes[key])}`}
                {showTooltip === `${key}-progress` && (
                  <div className="tooltip">
                    <strong>Question Distribution by Level:</strong>
                    <br />
                    {formatQuizLevelsExtended(quizzes[key])}
                  </div>
                )}
              </span>

              {/* Active Questions Tooltip */}
              <span
                className="stat-item"
                style={{ position: "relative", cursor: "pointer" }}
                onMouseEnter={() => setShowTooltip(`${key}-active`)}
                onMouseLeave={() => setShowTooltip(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowTooltip((prev) =>
                    prev === `${key}-active` ? null : `${key}-active`
                  );
                }}
              >
                {`Status: ${calculateActiveQuestions(quizzes[key]).length}/${
                  Array.isArray(quizzes[key]["questions"])
                    ? quizzes[key]["questions"].length
                    : Object.keys(quizzes[key]["questions"] || {}).length
                }`}
                {showTooltip === `${key}-active` && (
                  <div className="tooltip">
                    <strong>Active Questions Breakdown:</strong>
                    <br />
                    Unanswered: {calculateActiveQuestions(quizzes[key]).length}
                    <br />
                    Total:{" "}
                    {Array.isArray(quizzes[key]["questions"])
                      ? quizzes[key]["questions"].length
                      : Object.keys(quizzes[key]["questions"] || {}).length}
                    <br />
                    Answered:{" "}
                    {(Array.isArray(quizzes[key]["questions"])
                      ? quizzes[key]["questions"].length
                      : Object.keys(quizzes[key]["questions"] || {}).length) -
                      calculateActiveQuestions(quizzes[key]).length}
                  </div>
                )}
              </span>
            </div>
            <h3
              style={{
                marginTop: "40px",
                textAlign: "center",
                width: "100%",
              }}
            >
              {key}
            </h3>
            {/* Display the key (quiz name) */}
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
                  // Set the full quiz object with questions and metadata
                  setSelectedQuiz({
                    questions: questionsArray,
                    lastAccessed: quizzes[key]["lastAccessed"],
                    spacedLearning: quizzes[key]["spacedLearning"],
                    ...Object.fromEntries(
                      Object.entries(quizzes[key]).filter(
                        ([k]) => k !== "questions"
                      )
                    ),
                  });
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
        onClick={() => {
          if (maxReachedFree) return;
          navigate("/add-questions");
        }}
        role="button"
        tabIndex={maxReachedFree ? -1 : 0}
        onKeyDown={(e) => {
          if (maxReachedFree) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/add-questions");
          }
        }}
        style={{
          cursor: maxReachedFree ? "not-allowed" : "pointer",
          backgroundColor: maxReachedFree ? "#e8e8e8" : "#f0f0f0",
          border: "2px dashed #ccc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Caveat",
          transition: "all 0.3s ease",
          opacity: maxReachedFree ? 0.8 : 1,
        }}
        onMouseEnter={(e) => {
          if (maxReachedFree) return;
          e.currentTarget.style.backgroundColor = "#e8e8e8";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = maxReachedFree ? "#e8e8e8" : "#f0f0f0";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h3 style={{ color: "#888" }}>+ Add Quiz</h3>
        {isFreePlan && (
          <p style={{ fontSize: "0.75rem", color: "#888", margin: "4px 0 0", fontFamily: "Arial, sans-serif" }}>
            Max {freePlanMax} quizzes on the free plan
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizBoxes;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc } from "firebase/firestore";
import { db } from "../utils/firebase/firebaseDB";
import {
  updateDocument,
  getDocument,
  setDocument,
  appendToMapField,
} from "../utils/firebase/firebaseServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPen,
  faEye,
  faEyeSlash,
  faCheck,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const STUDY_TIP =
  "Try to recall the answer before revealing it. Active recall strengthens your memory! 💪";

const QuizView = ({
  selectedQuiz,
  selectedTitle,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  setSelectedQuiz,
  handlePrevQuestion,
  handleNextQuestion,
  toggleAnswerVisibility,
  showAnswer,
  email,
  skipFilterChoice = false,
  onEditQuiz, // optional: called when "Edit Quiz" is clicked (e.g. scroll to AddQuiz)
}) => {
  // console.log('all the props',{
  //   selectedQuiz,
  //   selectedTitle,
  //   currentQuestionIndex,
  //   setSelectedQuiz,
  //   handlePrevQuestion,
  //   handleNextQuestion,
  //   toggleAnswerVisibility,
  //   showAnswer,
  //   email,
  // });
  const navigate = useNavigate();
  const [filterChoice, setFilterChoice] = useState(skipFilterChoice ? "all" : null); // Track the user's filter choice
  const [showExitPopup, setShowExitPopup] = useState(false); // Track whether the exit popup is visible
  const [showQuizCompletion, setShowQuizCompletion] = useState(false); // Track quiz completion popup for cumulative test

  const handleExitQuiz = (immediateExit = false) => {
    if (immediateExit) {
      setSelectedQuiz(null); // Exit the quiz if it's completed
      setFilterChoice(null); // Reset filterChoice to null
      window.location.href = "#/home"; // Redirect to /home
      return;
    }
    // Extract questions from selectedQuiz (handle both object and array formats)
    const questionsArray = Array.isArray(selectedQuiz)
      ? selectedQuiz
      : selectedQuiz?.questions
        ? selectedQuiz.questions
        : Object.values(selectedQuiz || {});

    if (currentQuestionIndex + 1 < questionsArray.length) {
      setShowExitPopup(true); // Show the popup if the user hasn't finished the quiz
    } else {
      setSelectedQuiz(null); // Exit the quiz if it's completed
      setFilterChoice(null); // Reset filterChoice to null
    }
  };

  const handleContinueQuiz = () => {
    setShowExitPopup(false); // Close the popup and let the user continue
  };

  const handleConfirmExit = () => {
    setShowExitPopup(false); // Close the popup
    setSelectedQuiz(null); // Exit the quiz
  };
  const handleFilterChoice = (choice) => {
    // Check if this is a cumulative test BEFORE modifying selectedQuiz
    // Check both the isCumulativeTest flag and the selectedTitle
    const isCumulativeTest =
      selectedQuiz?.isCumulativeTest ||
      selectedTitle === "Cumulative Test" ||
      false;

    // Extract questions from selectedQuiz (handle both object and array formats)
    const questionsForFiltering = Array.isArray(selectedQuiz)
      ? selectedQuiz
      : selectedQuiz?.questions
        ? selectedQuiz.questions
        : Object.values(selectedQuiz || {});

    // Convert questions from map to array, preserving original map keys as originalIndex
    let questionsArray;
    if (Array.isArray(questionsForFiltering)) {
      // If already an array, preserve existing originalIndex or add it
      questionsArray = questionsForFiltering.map((question, index) => ({
        ...question,
        originalIndex:
          question.originalIndex !== undefined
            ? question.originalIndex
            : String(index),
      }));
    } else {
      // If it's a map, preserve the original keys
      questionsArray = Object.entries(questionsForFiltering || {}).map(
        ([key, question]) => ({
          ...question,
          originalIndex:
            question.originalIndex !== undefined
              ? question.originalIndex
              : String(key),
        })
      );
    }

    // Preserve metadata from selectedQuiz if it's an object
    const metadata = Array.isArray(selectedQuiz) ? {} : { ...selectedQuiz };
    // Remove questions to avoid duplication, but preserve other metadata
    delete metadata.questions;

    if (choice === "passed") {
      // Filter questions that are marked as passed (preserving originalIndex)
      const filteredQuestions = questionsArray.filter((q) => q.passed === true);
      setSelectedQuiz({ ...metadata, questions: filteredQuestions });
    } else if (choice === "notPassed") {
      // Filter questions that do not have a passed key or are not passed (preserving originalIndex)
      const filteredQuestions = questionsArray.filter((q) => q.passed !== true);
      setSelectedQuiz({ ...metadata, questions: filteredQuestions });
    } else {
      setSelectedQuiz({ ...metadata, questions: questionsArray });
    }
    setFilterChoice(choice); // Save the user's choice

    // Skip quizStats for cumulative test (it doesn't have a document)
    // Double-check: don't update if it's a cumulative test OR if selectedTitle is "Cumulative Test"
    if (
      !isCumulativeTest &&
      selectedTitle &&
      selectedTitle !== "Cumulative Test"
    ) {
      try {
        const startTime = new Date().toISOString(); // Get the current time in ISO format
        appendToMapField(
          `users/${email}/quizCollection/${selectedTitle}`,
          "quizStats",
          {
            start: startTime,
            filterChoice: choice,
            complete: false,
          }
        ).catch((error) => {
          console.error("Error appending quiz stats:", error);
        });
      } catch (error) {
        console.error("Error in quiz stats append:", error);
      }
    } else {
      console.log("Skipping quizStats update for cumulative test");
    }
  };
  const handleAnswerChoice = async (choice) => {
    console.log("handleAnswerChoice", choice);
    const levelTypesDoc = await getDocument("configs/levelTypes");
    let levelTypesDataStandard;
    levelTypesDataStandard = levelTypesDoc["standard"];

    try {
      // Extract questions from selectedQuiz (handle both object and array formats)
      const questionsArray = Array.isArray(selectedQuiz)
        ? selectedQuiz
        : selectedQuiz?.questions
          ? selectedQuiz.questions
          : Object.values(selectedQuiz || {});

      const currentQuestion = questionsArray[currentQuestionIndex]; // Get the current question

      // Use originalIndex if available (for filtered questions), otherwise use currentQuestionIndex
      const originalIndex =
        currentQuestion?.originalIndex !== undefined
          ? String(currentQuestion.originalIndex)
          : String(currentQuestionIndex);

      // Calculate updated values
      const passed = choice === "right";
      const lastAnswered = new Date().toISOString();
      let level, activeTime;

      if (choice === "right") {
        level = currentQuestion.level
          ? Math.min(currentQuestion.level + 1, 4)
          : 2;
        const addedDays = levelTypesDataStandard[Math.min(level, 4)]; //TODO possible bug here if a days does not exist
        const nextActiveDate = new Date();
        nextActiveDate.setDate(nextActiveDate.getDate() + addedDays); // Add the days to the current date
        activeTime = nextActiveDate.toISOString(); // Update activeTime when the question needs to be seen next
        console.log(
          "Answered right, setting level to",
          level,
          "next active time to",
          activeTime
        );
      } else {
        level =
          currentQuestion.level && currentQuestion.level - 1 > 0
            ? currentQuestion.level - 1
            : 1; // Reset level to 1 if answered wrong
        const subtractedDays = levelTypesDataStandard[Math.max(level, 1)];
        const nextActiveDate = new Date();
        nextActiveDate.setDate(nextActiveDate.getDate() + subtractedDays); // Add the days to the current date
        activeTime = nextActiveDate.toISOString(); // Update activeTime when question need to be seen next
        console.log(
          "Answered wrong, setting level to",
          level,
          "next active time to",
          activeTime
        );
      }

      // Update only the specific question using dot notation with originalIndex
      // questions map structure: { "0": {...}, "1": {...} }
      const questionIndex = originalIndex;
      const updateData = {
        [`questions.${questionIndex}.passed`]: passed,
        [`questions.${questionIndex}.lastAnswered`]: lastAnswered,
        [`questions.${questionIndex}.level`]: level,
        [`questions.${questionIndex}.activeTime`]: activeTime,
      };
      console.log("selectedTitle", selectedTitle);
      await updateDocument(
        `users/${email}/quizCollection/${selectedTitle}`,
        updateData
      ); // Update only the specific question fields

      // Update local state to reflect changes immediately
      // Preserve metadata from selectedQuiz if it's an object
      const metadata = Array.isArray(selectedQuiz)
        ? {}
        : { ...selectedQuiz, questions: undefined };
      delete metadata.questions; // Ensure questions is not in metadata

      const updatedQuestions = [...questionsArray];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        passed,
        lastAnswered,
        level,
        activeTime,
      };
      setSelectedQuiz({ ...metadata, questions: updatedQuestions });

      // Auto-advance to next question if not at the end
      const isLastQuestion = currentQuestionIndex + 1 >= questionsArray.length;
      
      if (!isLastQuestion) {
        // Hide answer for next question
        if (showAnswer) {
          toggleAnswerVisibility();
        }
        // Move to next question
        if (handleNextQuestion) {
          handleNextQuestion();
        } else if (setCurrentQuestionIndex) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } else {
        // We're on the last question - advance to show completion message
        // Hide answer first
        if (showAnswer) {
          toggleAnswerVisibility();
        }
        // Advance past the last question to trigger completion message
        if (setCurrentQuestionIndex) {
          setCurrentQuestionIndex(questionsArray.length);
        }
      }
    } catch (error) {
      console.error("Error updating question in Firestore:", error);
    }
  };

  // Extract questions from selectedQuiz (handle both object and array formats)
  const questionsArray = Array.isArray(selectedQuiz)
    ? selectedQuiz
    : selectedQuiz?.questions
      ? selectedQuiz.questions
      : Object.values(selectedQuiz || {});

  const currentQuestion = questionsArray[currentQuestionIndex];
  const isCumulativeTest = selectedQuiz?.isCumulativeTest || false;
  const isSpacedLearningQuiz =
    Boolean(selectedQuiz?.spacedLearning) &&
    selectedQuiz.spacedLearning !== "all";
  const currentQuizTitle = isCumulativeTest
    ? selectedQuiz.currentQuizTitle
    : selectedTitle;
  const quizList = isCumulativeTest ? selectedQuiz.quizList : null;
  const currentQuizIndex = isCumulativeTest ? selectedQuiz.currentQuizIndex : 0;

  // Non–spaced-learning quizzes skip the mode choice and go straight to the quiz
  useEffect(() => {
    if (!isSpacedLearningQuiz && filterChoice === null) {
      setFilterChoice("all");
    }
  }, [isSpacedLearningQuiz, filterChoice]);

  // Check if current quiz is completed and move to next quiz in cumulative test
  useEffect(() => {
    if (
      isCumulativeTest &&
      quizList &&
      currentQuestionIndex === questionsArray.length &&
      questionsArray.length > 0
    ) {
      // Current quiz is completed
      setShowQuizCompletion(true);
    }
  }, [currentQuestionIndex, questionsArray.length, isCumulativeTest, quizList]);

  // Handler to move to next quiz in cumulative test
  const handleNextQuiz = () => {
    if (isCumulativeTest && quizList && setCurrentQuestionIndex) {
      const nextQuizIndex = currentQuizIndex + 1;
      if (nextQuizIndex < quizList.length) {
        // Move to next quiz
        setSelectedQuiz({
          ...selectedQuiz,
          currentQuizIndex: nextQuizIndex,
          questions: quizList[nextQuizIndex].questions,
          currentQuizTitle: quizList[nextQuizIndex].title,
        });
        setCurrentQuestionIndex(0); // Reset to first question of next quiz
        setShowQuizCompletion(false);
      } else {
        // All quizzes completed
        setShowQuizCompletion(false);
        // Will show final completion message
      }
    }
  };

  // Handler to exit cumulative test after quiz completion
  const handleExitCumulativeTest = () => {
    setShowQuizCompletion(false);
    setSelectedQuiz(null);
    setFilterChoice(null);
  };

  // Points for completing quiz
  const handleAwardPoint = async () => {
    try {
      const pointsDoc = await getDocument(`users/${email}/pointSystem/points`);
      if (pointsDoc && pointsDoc.value !== undefined) {
        const currentPoints = pointsDoc.value || 0;
        await updateDocument(`users/${email}/pointSystem/points`, {
          value: currentPoints + 1,
        }); // Increment points by 1
      } else {
        await setDocument(`users/${email}/pointSystem/points`, { value: 1 }); // Create the document and set its value to 1
      }
    } catch (err) {
      console.error("Error updating points:", err);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex === questionsArray.length) {
      handleAwardPoint(); // Award the point when the user finishes the quiz
    }
  }, [currentQuestionIndex, questionsArray.length]);

  // Show quiz completion popup for cumulative test
  if (showQuizCompletion && isCumulativeTest && quizList) {
    const isLastQuiz = currentQuizIndex + 1 >= quizList.length;
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>
            {isLastQuiz
              ? "🎉 Cumulative Test Complete!"
              : `Quiz "${currentQuizTitle}" Complete!`}
          </h2>
          <p>
            {isLastQuiz
              ? "You have completed all quizzes in the cumulative test and earned 1 point!"
              : `You've finished all questions in "${currentQuizTitle}". Moving to the next quiz...`}
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {isLastQuiz ? (
              <button
                onClick={handleExitCumulativeTest}
                className="question-button"
              >
                Back to Quiz List
              </button>
            ) : (
              <>
                <button onClick={handleNextQuiz} className="question-button">
                  Continue to Next Quiz
                </button>
                <button
                  onClick={handleExitCumulativeTest}
                  className="question-button"
                >
                  Exit Cumulative Test
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show final completion for regular quiz or cumulative test
  if (currentQuestionIndex === questionsArray.length) {
    const isLastQuizInCumulative =
      isCumulativeTest && quizList && currentQuizIndex + 1 >= quizList.length;

    return (
      <div className="quiz-container">
        <h2>Congrats, you are done!</h2>
        <p>
          {isCumulativeTest
            ? isLastQuizInCumulative
              ? "You have completed the cumulative test and earned 1 point!"
              : "You have completed this quiz!"
            : "You have completed the quiz and earned 1 point!"}
        </p>
        <button
          onClick={() => handleExitQuiz(true)}
          className="question-button"
        >
          Back to Quiz List
        </button>
      </div>
    );
  }
  // Show the filter prompt only for spaced learning quizzes when the user hasn't chosen yet
  if (filterChoice === null && isSpacedLearningQuiz) {
    return (
      <div 
        className="quiz-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "2em",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "2.5em 3em",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            border: "1px solid #e0e0e0",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#333",
              marginBottom: "1.5em",
              fontSize: "1.8em",
              fontWeight: "600",
            }}
          >
            Choose Your Quiz Mode
          </h2>
          <div
            style={{
              display: "flex",
              gap: "1em",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handleExitQuiz(true)}
              className="question-button"
              style={{
                padding: "12px 24px",
                fontSize: "1em",
                borderRadius: "8px",
                border: "2px solid #ccc",
                backgroundColor: "#f5f5f5",
                color: "#333",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e8e8e8";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f5f5f5";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Back to Quiz List
            </button>
            <button
              onClick={() => handleFilterChoice("all")}
              className="question-button"
              style={{
                padding: "14px 32px",
                fontSize: "1.1em",
                fontWeight: "600",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              View All Questions
            </button>
            {/* Start Spaced Learning button - only show if quiz has spaced learning enabled */}
            {selectedQuiz?.spacedLearning && selectedQuiz.spacedLearning !== "all" && (
              <button
                onClick={() => {
                  // Extract questions from selectedQuiz
                  const questionsArray = Array.isArray(selectedQuiz)
                    ? selectedQuiz
                    : selectedQuiz?.questions
                      ? selectedQuiz.questions
                      : Object.values(selectedQuiz || {});
                  
                  navigate("/spaced-learning", {
                    state: {
                      initialData: {
                        title: selectedTitle,
                        questions: questionsArray,
                        lastAccessed: selectedQuiz?.lastAccessed,
                        spacedLearning: selectedQuiz.spacedLearning,
                      },
                      email,
                      title: selectedTitle,
                    },
                  });
                }}
                className="question-button"
                style={{
                  padding: "14px 32px",
                  fontSize: "1.1em",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.4)";
                }}
              >
                Start Spaced Learning
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progressPercent =
    questionsArray.length > 0
      ? Math.round(((currentQuestionIndex + 1) / questionsArray.length) * 100)
      : 0;
  const displayTitle =
    isCumulativeTest && currentQuizTitle
      ? `${selectedTitle} - ${currentQuizTitle}`
      : selectedTitle;
  const isSpacedLearning =
    selectedQuiz?.spacedLearning && selectedQuiz.spacedLearning !== "all";

  return (
    <div
      className="quiz-container quiz-view-redesign"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px 48px",
        maxWidth: "680px",
        margin: "0 auto",
      }}
    >
      {/* Top bar: Back to Quiz List | Edit Quiz */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <button
          type="button"
          onClick={() => handleExitQuiz(true)}
          className="quiz-view-top-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "12px",
            border: "none",
            background: "#e8e8e8",
            color: "#333",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ width: "16px" }} />
          Back to Quiz List
        </button>
      </div>

      {/* Quiz tag pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 20px",
          borderRadius: "999px",
          background: "linear-gradient(135deg, #ef476f 0%, #ff6ec4 100%)",
          color: "#fff",
          fontWeight: 600,
          marginBottom: "6px",
          boxShadow: "0 4px 14px rgba(239, 71, 111, 0.35)",
        }}
      >
        <FontAwesomeIcon icon={faStar} style={{ width: "14px" }} />
        {displayTitle}
      </div>

      {/* Progress: Question X of Y | bar | % */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.95)",
            minWidth: "100px",
          }}
        >
          Question {currentQuestionIndex + 1} of {questionsArray.length}
        </span>
        <div
          style={{
            flex: 1,
            height: "10px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.35)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              borderRadius: "999px",
              background: "linear-gradient(90deg, #ff9a3c 0%, #ff6ec4 50%, #ef476f 100%)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.95)",
            minWidth: "36px",
            textAlign: "right",
          }}
        >
          {progressPercent}%
        </span>
      </div>

      {/* Question card */}
      <div
        className="quiz-view-question-card"
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: "20px",
          padding: "28px 24px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.06)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#c45d7a",
            marginBottom: "8px",
          }}
        >
          QUESTION
        </div>
        <div
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#2b1f1c",
            lineHeight: 1.4,
            marginBottom: "8px",
          }}
        >
          {currentQuestion.question}
        </div>
      </div>

      {/* Show Answer */}
      <button
        type="button"
        onClick={toggleAnswerVisibility}
        className="quiz-view-show-answer-btn"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 24px",
          marginBottom: "24px",
          borderRadius: "12px",
          border: "none",
          background: "#e8e8e8",
          color: "#333",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <FontAwesomeIcon icon={showAnswer ? faEyeSlash : faEye} style={{ width: "18px" }} />
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </button>

      {/* Answer + feedback (when revealed) */}
      {showAnswer && (
        <>
          <div
            className="quiz-view-answer-card"
            style={{
              width: "100%",
              background: "#f8f8f8",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "24px",
              border: "1px solid #eee",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#c45d7a",
                marginBottom: "6px",
              }}
            >
              ANSWER
            </div>
            <div style={{ fontSize: "1.05rem", color: "#2b1f1c", lineHeight: 1.5 }}>
              {currentQuestion.answer}
            </div>
          </div>
          {/* Feedback buttons: go through handleAnswerChoice so choices are persisted to DB (passed, level, activeTime, etc.) */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => handleAnswerChoice("right")}
              className="quiz-view-feedback-btn right"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(90deg, #4CAF50 0%, #81c784 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
              }}
            >
              <FontAwesomeIcon icon={faCheck} style={{ width: "20px" }} />
              Got It Right!
              <span style={{ opacity: 0.9 }}>⭐</span>
            </button>
            <button
              type="button"
              onClick={() => handleAnswerChoice("wrong")}
              className="quiz-view-feedback-btn wrong"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(90deg, #ff9a3c 0%, #ef476f 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(239, 71, 111, 0.35)",
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ width: "20px" }} />
              Need Review
              <span style={{ opacity: 0.9 }}>📖</span>
            </button>
          </div>
        </>
      )}

      {/* Previous / Next */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
        <button
          type="button"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="quiz-view-nav-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            background: "#e8e8e8",
            color: "#333",
            fontWeight: 600,
            cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentQuestionIndex === 0 ? 0.6 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: "14px" }} />
          Previous
        </button>
        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questionsArray.length - 1}
          className="quiz-view-nav-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            background: "#e8e8e8",
            color: "#333",
            fontWeight: 600,
            cursor:
              currentQuestionIndex === questionsArray.length - 1
                ? "not-allowed"
                : "pointer",
            opacity:
              currentQuestionIndex === questionsArray.length - 1 ? 0.6 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          Next
          <FontAwesomeIcon icon={faChevronRight} style={{ width: "14px" }} />
        </button>
      </div>

      {/* Study Tip card */}
      <div
        className="quiz-view-study-tip"
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: "20px",
          padding: "20px 24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#c45d7a",
          }}
        >
          <FontAwesomeIcon icon={faStar} style={{ width: "14px" }} />
          <span>Study Tip</span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            color: "#444",
            lineHeight: 1.5,
          }}
        >
          {STUDY_TIP}
        </p>
      </div>

      {/* Exit Confirmation Popup */}
      {showExitPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>You haven&apos;t finished the quiz yet!</h3>
            <p>Do you want to continue or exit?</p>
            <button
              onClick={handleContinueQuiz}
              className="question-button"
            >
              Continue Quiz
            </button>
            <button onClick={handleConfirmExit} className="question-button">
              Exit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;

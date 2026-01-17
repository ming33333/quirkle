import React, { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { db } from "../utils/firebase/firebaseDB";
import {
  updateDocument,
  getDocument,
  setDocument,
  appendToMapField,
} from "../utils/firebase/firebaseServices";
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
  email, // Pass the user's email as a prop
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
  const [filterChoice, setFilterChoice] = useState(null); // Track the user's filter choice
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

      // For cumulative test, use the current quiz title from metadata
      const isCumulativeTest = selectedQuiz?.isCumulativeTest || false;
      const quizTitleToUpdate = isCumulativeTest
        ? selectedQuiz.currentQuizTitle
        : selectedTitle;

      // Update only the specific question using dot notation with originalIndex
      // questions map structure: { "0": {...}, "1": {...} }
      const questionIndex = originalIndex;
      const updateData = {
        [`questions.${questionIndex}.passed`]: passed,
        [`questions.${questionIndex}.lastAnswered`]: lastAnswered,
        [`questions.${questionIndex}.level`]: level,
        [`questions.${questionIndex}.activeTime`]: activeTime,
      };

      await updateDocument(
        `users/${email}/quizCollection/${quizTitleToUpdate}`,
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
  const currentQuizTitle = isCumulativeTest
    ? selectedQuiz.currentQuizTitle
    : selectedTitle;
  const quizList = isCumulativeTest ? selectedQuiz.quizList : null;
  const currentQuizIndex = isCumulativeTest ? selectedQuiz.currentQuizIndex : 0;

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
  // Show the filter prompt if the user hasn't made a choice yet
  if (filterChoice === null) {
    return (
      <div className="quiz-container">
        <h2>Choose Your Quiz Mode</h2>
        <button
          onClick={() => handleExitQuiz(true)}
          className="question-button"
        >
          Back to Quiz List
        </button>
        <div style={{ marginTop: "1em" }}>
          <button
            onClick={() => handleFilterChoice("passed")}
            className="question-button"
          >
            Passed Questions
          </button>
          <button
            onClick={() => handleFilterChoice("notPassed")}
            className="question-button"
          >
            Not Passed Questions
          </button>
          <button
            onClick={() => handleFilterChoice("all")}
            className="question-button"
          >
            All
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="quiz-container"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        onClick={() => handleExitQuiz(true)}
        style={{ marginBottom: "1em" }}
        className="question-button"
      >
        Back to Quiz List
      </button>
      <h2>
        {isCumulativeTest && currentQuizTitle
          ? `${selectedTitle} - ${currentQuizTitle}`
          : selectedTitle}
      </h2>
      {isCumulativeTest && quizList && (
        <p
          style={{
            fontSize: "0.9em",
            color: "#666",
            marginTop: "-10px",
            marginBottom: "10px",
          }}
        >
          Question {currentQuestionIndex + 1} of {questionsArray.length} in "
          {currentQuizTitle}" | Quiz {currentQuizIndex + 1} of {quizList.length}
        </p>
      )}
      <div
        className="question-navigation"
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1em",
            marginBottom: "1em",
          }}
        >
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="question-button navigation-button"
          >
            &lt; Prev
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questionsArray.length - 1}
            className="question-button navigation-button"
          >
            Next &gt;
          </button>
          {/* Exit Confirmation Popup */}
          {showExitPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>You haven't finished the quiz yet!</h3>
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
        <div
          className="quiz-box"
          style={{ margin: "1em 0", textAlign: "center" }}
        >
          <strong>
            Q{currentQuestionIndex + 1}/{questionsArray.length}:
          </strong>{" "}
          {currentQuestion.question}
          <br />
          <button
            onClick={toggleAnswerVisibility}
            className="question-button answer-toggle"
            style={{ marginTop: "1em" }}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
          {showAnswer && (
            <div>
              <strong>A:</strong> {currentQuestion.answer}
              <div
                className="answer-buttons"
                style={{
                  marginTop: "1em",
                  display: "flex",
                  justifyContent: "center",
                  gap: "1em",
                }}
              >
                <button
                  onClick={() => handleAnswerChoice("right")}
                  className="question-button right-button"
                >
                  Right
                </button>
                <button
                  onClick={() => handleAnswerChoice("wrong")}
                  className="question-button wrong-button"
                >
                  Wrong
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;

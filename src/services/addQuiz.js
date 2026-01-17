import React, { useState, useEffect } from "react";
import { collection, doc, deleteDoc, and } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../utils/firebase/firebaseDB";
import { useNavigate } from "react-router-dom";
import {
  getDocument,
  setDocument,
  updateDocument,
} from "../utils/firebase/firebaseServices";

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
  const handleAutoUpdate = async (index, questionField) => {
    try {
      const updatedQuestions = [...questions]; // Create a copy of the questions array

      // Convert array to map for database storage
      const questionsMap = {};
      updatedQuestions.forEach((question, idx) => {
        questionsMap[String(idx)] = question;
      });

      // Update the database with the modified questions map
      // TODO optimize data  update by only updating the changed field, currently updates entire questions map
      await updateDocument(
        `users/${email}/quizCollection/${initialData.title}`,
        { lastAccessed: new Date().toISOString(), questions: questionsMap }
      );

      console.log(
        `Question ${index + 1} updated successfully on.`,
        questionField
      );
    } catch (error) {
      console.error("Error updating question in Firestore:", error);
    }
  };
  const handleToggleStar = async (index) => {
    try {
      const updatedQuestions = [...questions]; // Create a copy of the questions array
      updatedQuestions[index].starred = !updatedQuestions[index].starred; // Toggle the star status
      setQuestions(updatedQuestions); // Update the state

      // Convert array to map for database storage
      const questionsMap = {};
      updatedQuestions.forEach((question, idx) => {
        questionsMap[String(idx)] = question;
      });

      // Update the database
      await updateDocument(`users/${email}/quizCollection/${title}`, {
        questions: questionsMap,
      });
    } catch (error) {
      console.error("Error updating star status in Firestore:", error);
    }
  };
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [title, setTitle] = useState(initialData?.title || ""); // Prefill title if provided
  const [questions, setQuestions] = useState(() => {
    if (initialData?.questions) {
      let questionsArray = Array.isArray(initialData.questions)
        ? initialData.questions
        : Object.values(initialData.questions); // Convert map to array if needed

      // Customize the questions initialization if needed
      return questionsArray.map((q) => ({
        ...q,
        starred: q.starred || false, // Ensure 'starred' field exists
        passed: q.passed || false, // Ensure 'passed' field exists
      }));
    }
    // Default to a single empty question
    return [{ question: "", answer: "", starred: false, passed: false }];
  });
  const [bulkInput, setBulkInput] = useState(""); // State for bulk input
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSpacedLearningPopup, setShowSpacedLearningPopup] = useState(false);
  const [currentSpacedLearning, setCurrentSpacedLearning] = useState(
    initialData?.spacedLearning || null
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Adjust the height of all textareas based on their content
    const textareas = document.querySelectorAll(".quiz-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto"; // Reset height
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
    const newQuestion = { question: "", answer: "" }; // Create a new empty question
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
      const quizRef = doc(db, "users", email, "quizCollection", title); // Reference the quiz document
      await deleteDoc(quizRef); // Delete the quiz document
      // console.log(`Quiz "${title}" deleted successfully!`);
      setTitle(""); // Clear the title
      setQuestions([]); // Clear the questions
      setShowDeletePopup(false); // Hide the popup
    } catch (err) {
      console.error("Error deleting quiz:", err);
    }
  };

  const confirmDeleteQuiz = () => {
    setShowDeletePopup(true); // Show the confirmation popup
  };

  const handleAddToSpacedLearning = () => {
    setShowSpacedLearningPopup(true); // Show the confirmation popup
  };

  const confirmAddToSpacedLearning = () => {
    updateDocument(`users/${email}/quizCollection/${title}`, {
      spacedLearning: "standard",
    });
    setCurrentSpacedLearning("standard");
    setShowSpacedLearningPopup(false); // Hide the confirmation popup
    navigate("/spaced-learning", {
      state: { initialData, email, title }, // Pass initialData to /spaced-learning
    });
  };

  const handleChangeSpacedLearning = async (value) => {
    await updateDocument(`users/${email}/quizCollection/${title}`, {
      spacedLearning: value,
    });
    setCurrentSpacedLearning(value);
    setShowSpacedLearningPopup(false);
  };

  const cancelAddToSpacedLearning = () => {
    setShowSpacedLearningPopup(false); // Hide the confirmation popup
  };

  const cancelDeleteQuiz = () => {
    setShowDeletePopup(false); // Hide the confirmation popup
  };

  const handleSubmit = async () => {
    try {
      const docRef = doc(db, "users", email);
      // Reference the 'quizCollection' subcollection
      const subcollectionRef = collection(docRef, "quizCollection");

      // Check if the user document exists
      const docSnap = await getDocument(`users/${email}`);
      console.log(`docsnap`, docSnap);
      if (!docSnap) {
        console.log(
          "User document does not exist. Creating a new user document..."
        );
        await setDocument(`users/${email}/`, {}); // Create the user document if it doesn't exist
      }
      console.log("User document exists or created successfully!");

      // Convert questions array to map for database storage
      const questionsMap = {};
      questions.forEach((question, index) => {
        questionsMap[String(index)] = question;
      });

      // Add or update the quiz document in the 'quizCollection' subcollection
      await setDocument(`users/${email}/quizCollection/${title}`, {
        title: title,
        questions: questionsMap,
      });

      console.log("Quiz added/updated successfully!");
    } catch (error) {
      console.error("Error adding/updating quiz:", error);
    }

    navigate("/home"); // Redirect to the main page after submission
  };
  const handleBulkAdd = () => {
    const newQuestions = bulkInput
      .split("\n") // Split by new lines
      .map((line) => line.split("\t")) // Split each line by tabs (for two columns)
      .filter((cols) => cols.length === 2) // Ensure each line has exactly 2 columns
      .map(([question, answer]) => ({
        question: question.trim(),
        answer: answer.trim(),
      })); // Map to question/answer objects

    setQuestions([...questions, ...newQuestions]); // Add new questions to the existing list
    setBulkInput(""); // Clear the bulk input field
  };
  console.log(`initialData`, initialData);
  return (
    <div className="main-content">
      <div className="add-quiz-container">
        <h2>{initialData ?  `Edit Quiz: ${title}` : "Add New Quiz"}</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            float: "right",
            padding: "4px 8px",
            marginTop: "-40px",
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "0.9em",
          }}
        >
          {isExpanded ? "−" : "+"}
        </button>
        {isExpanded && (
          <>
            {!initialDataEmpty && (
              <div
                className="button-group"
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={confirmDeleteQuiz}
                  className="delete-quiz-button"
                >
                  Delete Quiz
                </button>
                {currentSpacedLearning && currentSpacedLearning !== "all" ? (
                  <button
                    onClick={() => setShowSpacedLearningPopup(true)}
                    className="spaced-learning-button"
                  >
                    Change Learning Style
                  </button>
                ) : (
                  <button
                    onClick={handleAddToSpacedLearning}
                    className="spaced-learning-button"
                  >
                    Add to Spaced Learning
                  </button>
                )}
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
            {showSpacedLearningPopup && (
              <div className="popup-overlay">
                <div className="popup-content">
                  {currentSpacedLearning && currentSpacedLearning !== "all" ? (
                    <>
                      <h3>Change spaced learning for "{title}"</h3>
                      <p>Current Style: {currentSpacedLearning}</p>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "16px",
                          flexDirection: "column",
                        }}
                      >
                        <button
                          onClick={() => handleChangeSpacedLearning("all")}
                          className="confirm-add-to-spaced-learning-button"
                          style={{
                            backgroundColor:
                              currentSpacedLearning != "all"
                                ? "#4CAF50"
                                : "#2196F3",
                          }}
                        >
                          Change to None
                        </button>
                        <button
                          onClick={() => handleChangeSpacedLearning("green")}
                          className="confirm-add-to-spaced-learning-button"
                          style={{
                            backgroundColor:
                              currentSpacedLearning === "green"
                                ? "#4CAF50"
                                : "#4CAF50",
                          }}
                        >
                          Change to Green
                        </button>
                        <button
                          onClick={cancelAddToSpacedLearning}
                          className="cancel-add-to-spaced-learning-button"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>
                        Are you sure you want to add the quiz "{title}" to
                        spaced learning?
                      </h3>
                      <button
                        onClick={confirmAddToSpacedLearning}
                        className="confirm-add-to-spaced-learning-button"
                      >
                        Yes, Add to Spaced Learning
                      </button>
                      <button
                        onClick={cancelAddToSpacedLearning}
                        className="cancel-add-to-spaced-learning-button"
                      >
                        Cancel
                      </button>
                    </>
                  )}
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
                      {q.starred ? "★" : "☆"} Q{index + 1}{" "}
                      {/* Display star icon */}
                    </label>
                    {/* <label className="question-pass">{q.passed ? 'Passed' : 'Not Passed'}</label> */}
                  </div>
                  <textarea
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) =>
                      handleInputChange(index, "question", e.target.value)
                    }
                    onBlur={() => handleAutoUpdate(index, "question")} // Trigger auto-update on blur
                    className="quiz-textarea"
                  />
                  <textarea
                    placeholder="Answer"
                    value={q.answer}
                    onChange={(e) =>
                      handleInputChange(index, "answer", e.target.value)
                    }
                    onBlur={() => handleAutoUpdate(index, "answer")} // Trigger auto-update on blur
                    className="quiz-textarea"
                  />
                </div>
                <div className="options-menu">
                  <button
                    className="options-button"
                    onClick={() => {
                      const menu = document.getElementById(`menu-${index}`);
                      menu.style.display =
                        menu.style.display === "block" ? "none" : "block";
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
                      {q.starred ? "Unstar Question" : "Star Question"}
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
            <button
              onClick={handleBulkAdd}
              className="quiz-button bulk-add-button"
            >
              Add Bulk Questions
            </button>
            {initialDataEmpty && (
              <button
                onClick={handleSubmit}
                className="quiz-button submit-button"
              >
                {"Submit Quiz"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddQuiz;

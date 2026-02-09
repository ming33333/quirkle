import React, { useState, useEffect } from "react";
import { collection, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../utils/firebase/firebaseDB";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faSparkles,
  faPlus,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import {
  getDocument,
  setDocument,
  updateDocument,
} from "../utils/firebase/firebaseServices";
import { getPlanLimits } from "../config/subscriptionPlans";

const USER_SETTING_DOC_ID = "settings";
const SUBSCRIPTION_FIELD = "subscription status";

const AddQuiz = ({ email, quizData, showDropdown = true }) => {
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
        { lastAccessed: new Date().toISOString(), questions: questionsMap },
      );

      console.log(
        `Question ${index + 1} updated successfully on.`,
        questionField,
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
    initialData?.spacedLearning || null,
  );
  const [isExpanded, setIsExpanded] = useState(() => !showDropdown); // Always expanded when dropdown is hidden
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");

  const planLimits = getPlanLimits(subscriptionStatus);
  const atQuestionLimit = questions.length >= planLimits.maxQuestions;

  useEffect(() => {
    if (!email) return;
    const loadSubscription = async () => {
      try {
        const ref = doc(db, "users", email, "userSetting", USER_SETTING_DOC_ID);
        const snapshot = await getDoc(ref);
        const data = snapshot.exists() ? snapshot.data() : {};
        setSubscriptionStatus(data[SUBSCRIPTION_FIELD] ?? "free");
      } catch (err) {
        console.error("Error loading subscription:", err);
        setSubscriptionStatus("free");
      }
    };
    loadSubscription();
  }, [email]);

  useEffect(() => {
    // Adjust the height of all textareas based on their content
    const textareas = document.querySelectorAll(".quiz-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
    });
  }, [questions]); // Run whenever questions change

  const handleInputChange = (index, field, value) => {
    const capped = value.length > planLimits.maxChars ? value.slice(0, planLimits.maxChars) : value;
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = capped;
    setQuestions(updatedQuestions);
  };
  const handleAddQuestionAbove = (index) => {
    if (atQuestionLimit) return;
    const newQuestion = {
      question: "",
      answer: "",
      starred: false,
      passed: false,
    };
    const updatedQuestions = [
      ...questions.slice(0, index),
      newQuestion,
      ...questions.slice(index),
    ];
    setQuestions(updatedQuestions);
  };

  const handleAddQuestionBelow = (index) => {
    if (atQuestionLimit) return;
    const newQuestion = {
      question: "",
      answer: "",
      starred: false,
      passed: false,
    };
    const updatedQuestions = [
      ...questions.slice(0, index + 1),
      newQuestion,
      ...questions.slice(index + 1),
    ];
    setQuestions(updatedQuestions);
  };

  const handleAddNewQuestion = () => {
    if (atQuestionLimit) return;
    setQuestions([
      ...questions,
      { question: "", answer: "", starred: false, passed: false },
    ]);
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
          "User document does not exist. Creating a new user document...",
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
        lastAccessed: new Date().toISOString(),
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
    <div
      style={{
        minHeight: "100vh",
        background: "salmon",
        padding: "48px 16px 64px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1020px" }}>
        <div
          style={{
            position: "relative",
            marginBottom: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "2.4rem",
                fontWeight: 700,
                margin: "12px 0 4px",
                color: "white",
              }}
            >
              {initialData?.title ? `Edit Quiz` : "Create Quiz"}
            </h1>
            <p
              style={{
                margin: "0 auto",
                color: "white",
                fontSize: "1rem",
                maxWidth: "560px",
              }}
            >
              Build a study set with smart question cards, spaced learning
              hooks, and instant additions.
            </p>
          </div>
          {showDropdown && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "6px 12px",
                cursor: "pointer",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 8px 15px rgba(15, 15, 15, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "42px",
              }}
            >
              <FontAwesomeIcon
                icon={isExpanded ? faChevronUp : faChevronDown}
                style={{ width: "16px", height: "16px" }}
                color="salmon"
              />
            </button>
          )}
        </div>

        {(!showDropdown || isExpanded) && (
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "32px",
              padding: "40px",
              boxShadow: "0 40px 80px rgba(15, 15, 15, 0.08)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            {subscriptionStatus === "free" && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "24px",
                  borderRadius: "12px",
                  background: "rgba(255, 193, 7, 0.2)",
                  border: "1px solid rgba(255, 152, 0, 0.5)",
                  fontSize: "0.9rem",
                  color: "#5d4e37",
                }}
              >
                <strong>Free plan:</strong> Max {planLimits.maxQuestions} questions per quiz and {planLimits.maxChars} characters per question/answer. Upgrade for more.
              </div>
            )}
            {!initialDataEmpty && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "28px",
                }}
              >
                <button
                  onClick={confirmDeleteQuiz}
                  className="delete-quiz-button"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "18px",
                    border: "none",
                    background: "#ffe6e6",
                    color: "#c62828",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(198, 40, 40, 0.2)",
                  }}
                >
                  Delete Quiz
                </button>
                {currentSpacedLearning && currentSpacedLearning !== "all" ? (
                  <button
                    onClick={() => setShowSpacedLearningPopup(true)}
                    className="spaced-learning-button"
                    style={{
                      padding: "10px 18px",
                      borderRadius: "18px",
                      border: "1px solid rgba(255,255,255,0.6)",
                      background:
                        "linear-gradient(90deg, #67b26f, #4ca2cd, #3b8ad9)",
                      color: "#fff",
                      fontWeight: 600,
                      boxShadow: "0 10px 20px rgba(59, 138, 217, 0.25)",
                    }}
                  >
                    Change Learning Style
                  </button>
                ) : (
                  <button
                    onClick={handleAddToSpacedLearning}
                    className="spaced-learning-button"
                    style={{
                      padding: "10px 18px",
                      borderRadius: "18px",
                      border: "1px solid rgba(255,255,255,0.6)",
                      background:
                        "linear-gradient(90deg, #ff9a3c, #ff6ec4, #ef476f)",
                      color: "#fff",
                      fontWeight: 600,
                      boxShadow: "0 10px 20px rgba(239, 71, 111, 0.25)",
                    }}
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

            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#564f4a",
                }}
              >
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="Enter a catchy quiz title..."
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                maxLength={100}
                className="quiz-input"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "20px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  background: "rgba(255,255,255,0.8)",
                  fontSize: "1rem",
                  boxShadow: "inset 0 1px 4px rgba(15,15,15,0.05)",
                }}
              />
            </div>

            <div style={{ marginBottom: "36px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#403636",
                  }}
                >
                  Questions
                </span>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#7b6f6a",
                  }}
                >
                  {questions.length} cards
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {questions.map((q, index) => (
                  <div
                    key={index}
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255, 228, 243, 0.8))",
                      borderRadius: "24px",
                      padding: "22px",
                      boxShadow: "0 25px 40px rgba(15, 15, 15, 0.08)",
                      border: "1px solid rgba(255,255,255,0.6)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #ff9a3c, #ff6ec4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1rem",
                            boxShadow: "0 12px 18px rgba(239, 71, 111, 0.25)",
                          }}
                        >
                          {index + 1}
                        </div>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#2b1f1c",
                          }}
                        >
                          {q.starred ? "★" : "☆"} Q{index + 1}
                        </span>
                      </div>
                      <div className="options-menu">
                        <button
                          type="button"
                          className="options-button"
                          onClick={() => {
                            const menu = document.getElementById(
                              `menu-${index}`,
                            );
                            menu.style.display =
                              menu.style.display === "block" ? "none" : "block";
                          }}
                          aria-label="Question options"
                        >
                          <span className="options-button-dots">⋯</span>
                        </button>
                        <div id={`menu-${index}`} className="options-dropdown">
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(index)}
                            className="options-dropdown-item remove-button"
                          >
                            <span className="options-dropdown-icon">×</span>
                            Remove Question
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStar(index)}
                            className="options-dropdown-item star-button"
                          >
                            <span className="options-dropdown-icon">
                              {q.starred ? "★" : "☆"}
                            </span>
                            {q.starred ? "Unstar Question" : "Star Question"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddQuestionAbove(index)}
                            disabled={atQuestionLimit}
                            className="options-dropdown-item add-button"
                          >
                            <span className="options-dropdown-icon">+</span>
                            Add Question Above
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddQuestionBelow(index)}
                            disabled={atQuestionLimit}
                            className="options-dropdown-item add-button"
                          >
                            <span className="options-dropdown-icon">+</span>
                            Add Question Below
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <textarea
                          placeholder="Type your question..."
                          value={q.question}
                          onChange={(e) =>
                            handleInputChange(index, "question", e.target.value)
                          }
                          onBlur={() => handleAutoUpdate(index, "question")}
                          className="quiz-textarea"
                          maxLength={planLimits.maxChars}
                          style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "22px",
                            border: "2px dashed rgba(233, 185, 224, 0.8)",
                            background: "rgba(255,255,255,0.7)",
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#7d6077",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        />
                        {q.question.length >= planLimits.maxChars && (
                          <div
                            role="alert"
                            style={{
                              color: "#b91c1c",
                              fontSize: "0.875rem",
                              marginTop: "6px",
                              fontWeight: 600,
                              padding: "6px 10px",
                              background: "rgba(185, 28, 28, 0.12)",
                              borderRadius: "8px",
                              border: "1px solid rgba(185, 28, 28, 0.4)",
                            }}
                          >
                            Character limit reached ({planLimits.maxChars} chars). You cannot type or paste more.
                          </div>
                        )}
                      </div>
                      <div>
                        <textarea
                          placeholder="Type the answer..."
                          value={q.answer}
                          onChange={(e) =>
                            handleInputChange(index, "answer", e.target.value)
                          }
                          onBlur={() => handleAutoUpdate(index, "answer")}
                          className="quiz-textarea"
                          maxLength={planLimits.maxChars}
                          style={{
                        width: "100%",
                    padding: "16px",
                    borderRadius: "22px",
                    border: "2px dashed rgba(233, 185, 224, 0.8)",
                    background: "rgba(255,255,255,0.7)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#7d6077",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                          }}
                        />
                        {q.answer.length >= planLimits.maxChars && (
                          <div
                            role="alert"
                            style={{
                              color: "#b91c1c",
                              fontSize: "0.875rem",
                              marginTop: "6px",
                              fontWeight: 600,
                              padding: "6px 10px",
                              background: "rgba(185, 28, 28, 0.12)",
                              borderRadius: "8px",
                              border: "1px solid rgba(185, 28, 28, 0.4)",
                            }}
                          >
                            Character limit reached ({planLimits.maxChars} chars). You cannot type or paste more.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddNewQuestion}
                className="quiz-button add-new-question-button"
                style={{
                  marginTop: "24px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "22px",
                  fontWeight: 600,
                  border: "none",
                  background:
                    "linear-gradient(90deg, #ffe29f 0%, #ff6ec4 50%, #ef476f 100%)",
                  color: "white",
                  fontSize: "1.05rem",
                  boxShadow: "0 15px 30px rgba(239, 71, 111, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Question
              </button>
            </div>

            <div style={{ marginBottom: "32px" }}>
              {!showBulkInput ? (
                <button
                  onClick={() => setShowBulkInput(true)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "22px",
                    border: "2px dashed rgba(233, 185, 224, 0.8)",
                    background: "rgba(255,255,255,0.7)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#7d6077",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  Add Bulk Questions
                </button>
              ) : (
                <div
                  style={{
                    background: "rgba(237, 231, 255, 0.8)",
                    borderRadius: "22px",
                    padding: "18px",
                    border: "1px solid rgba(149, 114, 222, 0.5)",
                    boxShadow: "0 25px 35px rgba(98, 58, 150, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#4c3c6d",
                      }}
                    >
                      Paste questions and answers (tab-separated, one per line)
                    </span>
                    <button
                      onClick={() => setShowBulkInput(false)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 600,
                        color: "#4c3c6d",
                      }}
                    >
                      Close
                    </button>
                  </div>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Question 1	Answer 1&#10;Question 2	Answer 2"
                    className="bulk-input"
                    style={{
                      borderRadius: "16px",
                      border: "1px solid rgba(124, 103, 183, 0.4)",
                      padding: "14px",
                      minHeight: "120px",
                      fontSize: "0.95rem",
                      resize: "vertical",
                      background: "#fff",
                      boxShadow: "inset 0 2px 6px rgba(86, 61, 124, 0.1)",
                    }}
                  />
                  <button
                    onClick={() => {
                      handleBulkAdd();
                      setShowBulkInput(false);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "18px",
                      border: "none",
                      background:
                        "linear-gradient(90deg, #6a5af9, #ee6ba3, #ff9760)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "1rem",
                      boxShadow: "0 12px 25px rgba(123, 58, 210, 0.35)",
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Questions
                  </button>
                </div>
              )}
            </div>

            {initialDataEmpty && (
              <button
                onClick={handleSubmit}
                className="quiz-button submit-button"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "26px",
                  border: "none",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg, #ff9a3c, #ff6ec4, #ef476f)",
                  color: "#fff",
                  boxShadow: "0 20px 40px rgba(239, 71, 111, 0.35)",
                  marginBottom: "12px",
                }}
              >
                Submit Quiz ✨
              </button>
            )}
            <p
              style={{
                color: "#5e4c46",
                fontSize: "0.95rem",
                textAlign: "center",
                marginTop: "12px",
              }}
            >
              💡 Tip: Make your questions clear and concise for the best
              learning experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddQuiz;

import React, { useState, useEffect, useRef } from "react";
import { db } from "../utils/firebase/firebaseDB";
import QuizBoxes from "./quizBoxes";
import QuizView from "./quizView";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import AddQuiz from "../services/addQuiz";

const USER_SETTING_DOC_ID = "settings";
const SUBSCRIPTION_FIELD = "subscription status";
const FREE_PLAN_MAX_QUIZZES = 10;

const MainContent = ({
  email,
  selectedQuiz,
  setSelectedQuiz,
  selectedTitle,
  setSelectedTitle,
}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' or 'spacedLearning'
  const addQuizRef = useRef(null);

  const isFreePlan = subscriptionStatus !== "basic";

  useEffect(() => {
    const fetchQuizzes = async () => {
      console.log("Fetching quizzes...");
      try {
        const docRef = doc(db, "users", email);
        // Reference the 'questionsCollection' subcollection
        const subcollectionRef = collection(docRef, "quizCollection");
        const querySnapshot = await getDocs(subcollectionRef);
        // console.log('QuerySnapshot:', querySnapshot);
        // Convert querySnapshot into a Map
        const quizzesData = {};
        querySnapshot.forEach((doc) => {
            quizzesData[doc.id] = doc.data();
        });
        // Sort quizzesData by lastAccessed in descending order
        const sortedQuizzesData = Object.fromEntries(
          Object.entries(quizzesData).sort(
            ([, a], [, b]) =>
            new Date(b.lastAccessed) - new Date(a.lastAccessed)
          )
        );
        setQuizzes(sortedQuizzesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

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

  if (loading) {
    return <div className="main-content">Loading...</div>;
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setShowAnswer(false); // Hide answer when navigating to previous question
  };

  const handleNextQuestion = () => {
    const questions = Array.isArray(selectedQuiz)
      ? selectedQuiz
      : selectedQuiz?.questions || [];
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, questions.length - 1)
    );
    setShowAnswer(false); // Hide answer when navigating to next question
  };

  const toggleAnswerVisibility = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  // if (!selectedQuiz) {
  //   return (
  //     <div className="main-content">
  //       <QuizBoxes quizzes={quizzes} setSelectedQuiz={setSelectedQuiz} setSelectedTitle={setSelectedTitle}/>
  //     </div>
  //   );

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredQuizzes =
    filter === "all"
      ? quizzes
      : Object.fromEntries(
          Object.entries(quizzes).filter(
            ([, quiz]) =>
              quiz.spacedLearning &&
              typeof quiz.spacedLearning === "string" &&
              ["blue", "green", "standard"].includes(quiz.spacedLearning)
          )
        );

  const quizzesToShow =
    isFreePlan && Object.keys(filteredQuizzes).length > FREE_PLAN_MAX_QUIZZES
      ? Object.fromEntries(
          Object.entries(filteredQuizzes).slice(0, FREE_PLAN_MAX_QUIZZES)
        )
      : filteredQuizzes;
  const maxReachedFree =
    isFreePlan && Object.keys(filteredQuizzes).length >= FREE_PLAN_MAX_QUIZZES;

  if (!selectedQuiz) {
    return (
      <div className="main-content">
        <div
          className="filter-controls"
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => handleFilterChange("all")}
            style={{
              padding: "10px 20px",
              border: "2px solid #fff",
              backgroundColor: filter === "all" ? "#fff" : "transparent",
              color: filter === "all" ? "#d32f2f" : "#fff",
              fontWeight: filter === "all" ? "600" : "400",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "4px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            All
          </button>
          <button
            className={filter === "spacedLearning" ? "active" : ""}
            onClick={() => handleFilterChange("spacedLearning")}
            style={{
              padding: "10px 20px",
              border: "2px solid #fff",
              backgroundColor:
                filter === "spacedLearning" ? "#fff" : "transparent",
              color: filter === "spacedLearning" ? "#d32f2f" : "#fff",
              fontWeight: filter === "spacedLearning" ? "600" : "400",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "4px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Spaced Learning
          </button>
        </div>
        <div className="main-content">
          <QuizBoxes
            quizzes={quizzesToShow}
            setSelectedQuiz={setSelectedQuiz}
            setSelectedTitle={setSelectedTitle}
            spacedLearning={filter === "spacedLearning"}
            isFreePlan={isFreePlan}
            maxReachedFree={maxReachedFree}
            freePlanMax={FREE_PLAN_MAX_QUIZZES}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <QuizView
        selectedQuiz={selectedQuiz}
        selectedTitle={selectedTitle}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        setSelectedQuiz={setSelectedQuiz}
        handlePrevQuestion={handlePrevQuestion}
        handleNextQuestion={handleNextQuestion}
        toggleAnswerVisibility={toggleAnswerVisibility}
        showAnswer={showAnswer}
        email={email}
        onEditQuiz={() => addQuizRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      <div ref={addQuizRef}>
        <AddQuiz 
        email={email}
        quizData={{
          title: selectedTitle,
          questions: Array.isArray(selectedQuiz)
            ? selectedQuiz
            : selectedQuiz?.questions,
          lastAccessed: selectedQuiz?.lastAccessed,
          spacedLearning: selectedQuiz?.spacedLearning,
        }}
      />
      </div>
    </div>
  );
};

export default MainContent;

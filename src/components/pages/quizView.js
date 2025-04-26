const QuizView = ({
  selectedQuiz,
  selectedTitle,
  currentQuestionIndex,
  setSelectedQuiz,
  handlePrevQuestion,
  handleNextQuestion,
  toggleAnswerVisibility,
  showAnswer,
}) => {
  const currentQuestion = selectedQuiz[currentQuestionIndex];
  console.log(`selectedQuiz: ${JSON.stringify(selectedQuiz)} and title: ${selectedTitle}`);

  return (
    <div className="main-content">
      <button onClick={() => setSelectedQuiz(null)} style={{ marginBottom: '1em' }} className="question-button">
        Back to Quiz List
      </button>
      <h2>{selectedTitle}</h2> {/* Display the selected title */}
      <div className="question-navigation">
        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="question-button">
          &lt; Prev
        </button>
        <div className="question">
          <strong>
            Q{currentQuestionIndex + 1}/{selectedQuiz.length}:
          </strong>{' '}
          {currentQuestion.question}
          <br />
          <button onClick={toggleAnswerVisibility} className="question-button answer-toggle">
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          {showAnswer && (
            <div>
              <strong>A:</strong> {currentQuestion.answer}
            </div>
          )}
        </div>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === selectedQuiz.length - 1}
          className="question-button"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default QuizView;
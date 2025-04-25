const QuizView = ({
    selectedQuiz,
    currentQuestionIndex,
    setSelectedQuiz,
    handlePrevQuestion,
    handleNextQuestion,
    toggleAnswerVisibility,
    showAnswer,
  }) => {
    const currentQuestion = selectedQuiz[currentQuestionIndex];
  
    return (
      <div className="main-content">
        <button onClick={() => setSelectedQuiz(null)} style={{ marginBottom: '1em' }} className="question-button">
          Back to Quiz List
        </button>
        <h2>{selectedQuiz.title}</h2>
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
  
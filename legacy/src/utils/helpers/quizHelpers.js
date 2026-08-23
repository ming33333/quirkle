/**
 * Calculates the number of active questions in a quiz.
 * A question is considered active if it has no `activeTime` or if its `activeTime` is before the current date.
 *
 * @param {Object} quiz - The quiz object containing questions.
 * @returns {number} The count of active questions.
 */
const calculateActiveQuestions = (quiz) => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 59);
  const activeQuestions = [];
  const parseActiveTime = (activeTime) => {
    if (!activeTime) {
      return null;
    }
    if (typeof activeTime?.toDate === "function") {
      return activeTime.toDate();
    }
    const parsed = new Date(activeTime);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  // Convert questions map to array if needed
  const questionsArray = Array.isArray(quiz.questions)
    ? quiz.questions
    : Object.values(quiz.questions || {});

  questionsArray.forEach((question) => {
    const activeDate = parseActiveTime(question.activeTime);
    if (!activeDate || activeDate <= currentDate) {
      activeQuestions.push(question);
    }
  });
  return activeQuestions;
};

// Export the function
export { calculateActiveQuestions };

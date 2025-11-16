
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
        let activeQuestions = [];
        quiz.questions.forEach((question) => {
          if (!question.activeTime){
            activeQuestions.push(question); // Add question to activeQuestions if no activeTime
      } else
      {
        if (new Date(question.activeTime) <= currentDate) {
            activeQuestions.push(question); // Add question to activeQuestions if no activeTime
        }
      }

    });
    return activeQuestions
};

// Export the function
export  {calculateActiveQuestions};
import { configs } from "eslint-plugin-react";
import { collection } from "firebase/firestore";
const db = {
  configsCollection: {
    collectionName: 'configs', // Collection name
    levelType: { // Document name
      standard: [{
        1:1,
        2:2,
        3:4,
        4:8
      }]
    },
  },
  usersCollection: {
    collectionName: 'users', // Collection name
    userEmail: { // User's email as document ID, example test@email.com
      friendCollection: {
        colletionName: 'friendCollection', // Subcollection name
        friends: {}, // document for friends
        requests: {}, // document for friend requests},
      },
      pointSystem: {
        collectionName: 'pointSystem', // Subcollection name
        points: { value: 0 }, // Document for points
      },
      quizCollection: {
        collectionName: 'quizCollection', // Subcollection name
        quizName: { // Quiz name as document ID, example Test Quiz
          //Fields for Quiz name
          lastAccessed: '', // Timestamp of last accessed
          title: '', // Title of the quiz
          questions: {
            num : {
              question: '', // Question text
              answers: '', // Question answer
              activeTime: '', // time question answered
              passed: false, // whether question was passed
              level: 1, // level of the question
            }
          }
        },
      },
    },
  },
};

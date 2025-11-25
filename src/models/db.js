const db = {
  usersCollection: {
    collectionName: 'users', // Collection name
    // User's email as document ID
    userEmail: {
      friendCollection: {
        friends: {}, // Subcollection for friends
        requests: {}, // Subcollection for friend requests},
      },
      pointSystem: {
        // Subcollection for points
        points: { value: 0 }, // Document for points
      },
      quizCollection: {
        'quiz#': {}, // Subcollection for quizzes
      },
    },
  },
};

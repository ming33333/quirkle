
const db = {
    "usersCollection":{ 
        "collectionName": "users", // Collection name
        "userEmail": // User's email as document ID
        { 
            "friendCollection": {
                "friends": { }, // Subcollection for friends
                "requests": { },// Subcollection for friend requests},
             }, 
            "pointSystem": { // Subcollection for points
                "points": { "value": 0 }, // Document for points
            },
            "quizCollection": {
                "quiz#":{} // Subcollection for quizzes
            }, 
        },
    }
}




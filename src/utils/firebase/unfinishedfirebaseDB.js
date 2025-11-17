// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

class firebaseDB {
  constructor(path) {
    console.log('Initializing Firebase DB at path:', path);
    this.firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    };
    try {
      if (!this.firebaseConfig.apiKey) {
        throw new Error('Firebase API key is missing.');
      }
      this.app = initializeApp(this.firebaseConfig);
      this.analytics = getAnalytics(this.app);
      this.db = getFirestore(this.app);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      this.db = null; // Set db to null if initialization fails
    }
  }

  async updateQuiz(data) {
    try {
      const docRef = doc(this.db, 'users', email);
      // Reference the 'questionsCollection' subcollection
      const subcollectionRef = collection(docRef, 'quizCollection');
      const querySnapshot = await getDocs(subcollectionRef);
      // console.log('QuerySnapshot:', querySnapshot);
      // Convert querySnapshot into a Map
      const quizzesData = {};
      querySnapshot.forEach((doc) => {
        quizzesData[doc.id] = doc.data();
      });
      // console.log('Quizzes:', JSON.stringify(quizzesData));
      setQuizzes(quizzesData);
      setLoading(false);
      setQuizzes(quizzesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  }
}

//export { db };

import { db } from './firebaseDB';
import { doc, updateDoc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore';
import { arrayUnion } from 'firebase/firestore';

/**
 * Updates a document in the Firestore database.
 *
 * @param {string} docPath - The path to the document in the Firestore database.
 * @param {Object} data - The data to update in the document.
 * @returns {Promise<void>} - A promise that resolves when the document is updated.
 */
export const updateDocument = async (docPath, data) => {
  try {
    const documentRef = doc(db, docPath);
    await updateDoc(documentRef, data);
  } catch (error) {
    console.error(`Error updating document at ${JSON.stringify(docPath)}:`, error);
    throw error;
  }
};

/**
 * Creates or overwrites a document in the Firestore database.
 *
 * @param {string} docPath - The path to the document in the Firestore database.
 * @param {Object} data - The data to set in the document.
 * @param {boolean} [merge=false] - Whether to merge the data with the existing document.
 * @returns {Promise<void>} - A promise that resolves when the document is set.
 */
export const setDocument = async (docPath, data, merge = false) => {
  try {
    const documentRef = doc(db, docPath);
    await setDoc(documentRef, data, { merge });
    console.log(`Document at ${docPath} set successfully.`);
  } catch (error) {
    console.error(`Error setting document at ${docPath}:`, error);
    throw error;
  }
};

/**
 * Retrieves a document from the Firestore database.
 *
 * @param {string} docPath - The path to the document in the Firestore database.
 * @returns {Promise<Object>} - A promise that resolves with the document data, or null if the document does not exist.
 */
export const getDocument = async (docPath) => {
  try {
    const documentRef = doc(db, docPath);
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
      return documentSnapshot.data(); // Return the document data
    } else {
      console.warn(`Document at ${docPath} does not exist.`);
      return null; // Return null if the document does not exist
    }
  } catch (error) {
    console.error(`Error fetching document at ${docPath}:`, error);
    throw error;
  }
};
/**
 * Retrieves a document from the Firestore database.
 *
 * @param {string} docPath - The path to the document in the Firestore database.
 * @returns {Promise<Object>} - A promise that resolves with the document data, or null if the document does not exist.
 */
export const getDocuments = async (docPath) => {
  try {
    const documentRef = collection(db, docPath);
    const documentSnapshot = await getDocs(documentRef);

    if (documentSnapshot) {
      return documentSnapshot; // Return the document data
    } else {
      console.warn(`Document at ${docPath} does not exist.`);
      return null; // Return null if the document does not exist
    }
  } catch (error) {
    console.error(`Error fetching document at ${docPath}:`, error);
    throw error;
  }
};

/**
 * Appends data to a map field in a Firestore document.
 *
 * @param {string} docPath - The path to the document in the Firestore database.
 * @param {string} mapField - The name of the map field to append data to.
 * @param {Object} data - The data to append to the map field.
 * @returns {Promise<void>} - A promise that resolves when the data is appended.
 */
export const appendToMapField = async (docPath, mapField, data) => {
  try {
    const documentRef = doc(db, docPath);
    await updateDoc(documentRef, {
      [mapField]: arrayUnion(data),
    });
    // console.log(`Data appended to map field ${mapField} in document at ${docPath} successfully.`);
  } catch (error) {
    console.error(
      `Error appending data to map field ${mapField} in document at ${docPath}:`,
      error
    );
    throw error;
  }
};

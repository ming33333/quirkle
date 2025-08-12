import { db } from './firebaseDB';
import { doc, updateDoc } from 'firebase/firestore';

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
        console.log(`Document at ${docPath} updated successfully.`);
    } catch (error) {
        console.error(`Error updating document at ${docPath}:`, error);
        throw error;
    }
};
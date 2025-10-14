import { db } from './firebaseDB';
import { doc, updateDoc } from 'firebase/firestore';
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
        // console.log(`Document at ${docPath} updated successfully.`);
    } catch (error) {
        console.error(`Error updating document at ${docPath}:`, error);
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
            [mapField]: arrayUnion(data)
        });
        // console.log(`Data appended to map field ${mapField} in document at ${docPath} successfully.`);
    } catch (error) {
        console.error(`Error appending data to map field ${mapField} in document at ${docPath}:`, error);
        throw error;
    }
};
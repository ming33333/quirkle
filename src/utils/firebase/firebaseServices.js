import { db } from "./firebaseDB";
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  setDoc,
  collection,
} from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";

/**
 * Updates a document in the Firestore database.
 *
 * @param {string} docPath - The path to the document in the Firestore database.
 * @param {Object} data - The data to update in the document.
 * @returns {Promise<void>} - A promise that resolves when the document is updated.
 */
export const updateDocument = async (docPath, data) => {
  console.log(`docpath ${docPath} data ${JSON.stringify(data)}`);
  try {
    const documentRef = doc(db, docPath);
    await updateDoc(documentRef, data);
  } catch (error) {
    console.error(
      `Error updating document at ${JSON.stringify(docPath)}:`,
      error
    );
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

/**
 * Checks if a user is an admin by verifying if their email exists as a document in the 'admins' collection.
 *
 * @param {string} userEmail - The email of the user to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is an admin, false otherwise.
 */
export const isAdmin = async (userEmail) => {
  try {
    if (!userEmail) {
      return false;
    }

    const adminsSnapshot = await getDocuments("admins");

    if (!adminsSnapshot) {
      return false;
    }

    // Check if any document ID in the admins collection matches the user's email
    const adminExists = adminsSnapshot.docs.some(
      (adminDoc) => adminDoc.id === userEmail
    );

    return adminExists;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Gets all documents from a collection with their IDs.
 *
 * @param {string} collectionPath - The path to the collection (e.g., 'users', 'admins').
 * @returns {Promise<Array>} - A promise that resolves to an array of objects with id and data properties.
 */
export const getAllDocumentsFromCollection = async (collectionPath) => {
  try {
    const snapshot = await getDocuments(collectionPath);
    if (!snapshot || !snapshot.docs) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
      ref: doc.ref,
    }));
  } catch (error) {
    console.error(
      `Error fetching documents from collection ${collectionPath}:`,
      error
    );
    throw error;
  }
};

/**
 * Gets subcollections for a given document path.
 * Note: Firestore client SDK doesn't support listing subcollections directly.
 * This function returns an empty array as a placeholder.
 * To get subcollections, you need to know their names or use the Admin SDK on the server.
 *
 * @param {string} docPath - The path to the document (e.g., 'users/user@example.com').
 * @returns {Promise<Array>} - A promise that resolves to an empty array (subcollections cannot be listed from client SDK).
 */
export const getSubcollections = async (docPath) => {
  // Note: Firestore client SDK doesn't support listing subcollections
  // This would require Admin SDK on the server side
  // For now, we'll return common subcollection names based on the document structure
  return [];
};

/**
 * Converts an array field to a map field in a Firestore document.
 * Uses array index as the key and the array element as the value.
 *
 * @param {string} docPath - The path to the document (e.g., 'users/user@example.com/quizCollection/quiz1').
 * @param {string} arrayFieldName - The name of the array field to convert (e.g., 'quiz', 'questions').
 * @param {Object} options - Migration options.
 * @param {boolean} options.dryRun - If true, returns the result without updating the document.
 * @param {boolean} options.overwrite - If true, overwrites existing map field. If false, merges with existing data.
 * @returns {Promise<Object>} - A promise that resolves with the migration result.
 */
export const migrateArrayToMap = async (
  docPath,
  arrayFieldName,
  options = { dryRun: false, overwrite: false }
) => {
  try {
    // Get the current document
    const currentData = await getDocument(docPath);
    if (!currentData) {
      throw new Error(`Document at ${docPath} does not exist.`);
    }

    // Check if the array field exists
    if (!(arrayFieldName in currentData)) {
      throw new Error(
        `Field '${arrayFieldName}' does not exist in document at ${docPath}.`
      );
    }

    const arrayValue = currentData[arrayFieldName];

    // Validate that the field is an array
    if (!Array.isArray(arrayValue)) {
      throw new Error(
        `Field '${arrayFieldName}' is not an array. Current type: ${typeof arrayValue}.`
      );
    }

    // Convert array to map using index as key
    const mapValue = {};
    arrayValue.forEach((item, index) => {
      mapValue[String(index)] = item;
    });

    // Prepare update data
    const updateData = {
      [arrayFieldName]: mapValue,
    };

    // If dry run, return without updating
    if (options.dryRun) {
      return {
        success: true,
        docPath,
        arrayFieldName,
        originalValue: arrayValue,
        newValue: mapValue,
        itemCount: arrayValue.length,
        dryRun: true,
      };
    }

    // Update the document
    const documentRef = doc(db, docPath);
    if (options.overwrite) {
      // Replace the field completely
      await updateDoc(documentRef, updateData);
    } else {
      // Merge with existing data (Firestore merge)
      await setDoc(documentRef, updateData, { merge: true });
    }

    return {
      success: true,
      docPath,
      arrayFieldName,
      originalCount: arrayValue.length,
      newCount: Object.keys(mapValue).length,
      migrated: true,
    };
  } catch (error) {
    console.error(`Error migrating array to map at ${docPath}:`, error);
    return {
      success: false,
      docPath,
      arrayFieldName,
      error: error.message,
    };
  }
};

/**
 * Bulk migration: Converts array fields to map fields for multiple documents.
 *
 * @param {Array<string>} docPaths - Array of document paths to migrate.
 * @param {string} arrayFieldName - The name of the array field to convert.
 * @param {Object} options - Migration options.
 * @param {boolean} options.dryRun - If true, returns results without updating documents.
 * @param {boolean} options.overwrite - If true, overwrites existing map fields.
 * @param {Function} options.onProgress - Callback function called for each document with progress info.
 * @returns {Promise<Object>} - A promise that resolves with migration results summary.
 */
export const bulkMigrateArrayToMap = async (
  docPaths,
  arrayFieldName,
  options = { dryRun: false, overwrite: false, onProgress: null }
) => {
  const results = {
    total: docPaths.length,
    successful: 0,
    failed: 0,
    skipped: 0,
    details: [],
  };

  for (let i = 0; i < docPaths.length; i++) {
    const docPath = docPaths[i];
    try {
      const result = await migrateArrayToMap(docPath, arrayFieldName, options);

      if (result.success) {
        if (result.migrated || result.dryRun) {
          results.successful++;
        } else {
          results.skipped++;
        }
      } else {
        results.failed++;
      }

      results.details.push(result);

      // Call progress callback if provided
      if (options.onProgress) {
        options.onProgress({
          current: i + 1,
          total: docPaths.length,
          docPath,
          result,
        });
      }
    } catch (error) {
      results.failed++;
      results.details.push({
        success: false,
        docPath,
        arrayFieldName,
        error: error.message,
      });

      if (options.onProgress) {
        options.onProgress({
          current: i + 1,
          total: docPaths.length,
          docPath,
          result: { success: false, error: error.message },
        });
      }
    }
  }

  return results;
};

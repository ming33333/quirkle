import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { updateDocument, appendToMapField } from './firebaseServices';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

let testEnv;

beforeAll(async () => {
  // Initialize the Firebase Test Environment
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project-id',
    firestore: {
      rules: `
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true;
            }
          }
        }
      `,
    },
  });
});

afterAll(async () => {
  // Clean up the test environment
  await testEnv.cleanup();
});

beforeEach(async () => {
  // Clear the database before each test
  await testEnv.clearFirestore();
});

test('updateDocument updates specific fields in a document', async () => {
  const db = testEnv.authenticatedContext('test-user').firestore();
  const docPath = 'testCollection/testDoc';
  const initialData = { field1: 'value1', field2: 'value2' };

  // Set initial data
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const adminDb = context.firestore();
    await adminDb.collection('testCollection').doc('testDoc').set(initialData);
  });

  // Call the function to update the document
  await updateDocument(docPath, { field1: 'updatedValue' });

  // Verify the document was updated
  const docRef = doc(db, docPath);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();

  expect(data.field1).toBe('updatedValue');
  expect(data.field2).toBe('value2'); // Ensure other fields are not overwritten
});

test('appendToMapField appends data to a map field in a document', async () => {
  const db = testEnv.authenticatedContext('test-user').firestore();
  const docPath = 'testCollection/testDoc';
  const initialData = { mapField: ['item1'] };

  // Set initial data
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const adminDb = context.firestore();
    await adminDb.collection('testCollection').doc('testDoc').set(initialData);
  });

  // Call the function to append data to the map field
  await appendToMapField(docPath, 'mapField', 'item2');

  // Verify the map field was updated
  const docRef = doc(db, docPath);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();

  expect(data.mapField).toContain('item1');
  expect(data.mapField).toContain('item2');
});
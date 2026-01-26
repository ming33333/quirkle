import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase/firebaseDB";
import {
  getAllDocumentsFromCollection,
  getDocument,
  migrateArrayToMap,
  bulkMigrateArrayToMap,
} from "../utils/firebase/firebaseServices";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Known subcollections based on the database structure
 * Since Firestore client SDK doesn't support listing subcollections,
 * we define known subcollection names here.
 */
const KNOWN_SUBCOLLECTIONS = {
  users: ["quizCollection", "friendCollection", "pointSystem", "userSetting"],
  // Add more known subcollections as needed
};

/** Subscription statuses stored at users/{userId}/userSetting/settings { "subscription status": value } */
const SUBSCRIPTION_STATUSES = ["free", "basic"];
const USER_SETTING_DOC_ID = "settings";
const SUBSCRIPTION_FIELD = "subscription status";

const Admin = ({ user }) => {
  const [collections, setCollections] = useState([]);
  const [expandedCollections, setExpandedCollections] = useState(new Set());
  const [expandedDocuments, setExpandedDocuments] = useState(new Set());
  const [expandedSubcollections, setExpandedSubcollections] = useState(
    new Set()
  );
  const [documentsCache, setDocumentsCache] = useState({});
  const [subcollectionsCache, setSubcollectionsCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [error, setError] = useState(null);

  // Migration state
  const [migrationMode, setMigrationMode] = useState("single"); // "single", "bulk", "collection", or "bulkCollections"
  const [singleDocPath, setSingleDocPath] = useState("");
  const [bulkDocPaths, setBulkDocPaths] = useState("");
  const [collectionPath, setCollectionPath] = useState("");
  const [bulkCollectionPaths, setBulkCollectionPaths] = useState("");
  const [arrayFieldName, setArrayFieldName] = useState("quiz");
  const [migrationPreview, setMigrationPreview] = useState(null);
  const [migrationResults, setMigrationResults] = useState(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(null);

  // Subscription status tool: users/{userId}/userSetting/settings
  const [subscriptionUserId, setSubscriptionUserId] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    SUBSCRIPTION_STATUSES[0]
  );
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState(null);
  const [currentLoadedStatus, setCurrentLoadedStatus] = useState(null);

  // Known top-level collections
  const knownCollections = [
    "users",
    "admins",
    "configs",
    // Add more known collections as needed
  ];

  useEffect(() => {
    // Load known collections initially
    setCollections(knownCollections);
  }, []);

  const toggleCollection = async (collectionName) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionName)) {
      newExpanded.delete(collectionName);
    } else {
      newExpanded.add(collectionName);
      // Fetch documents if not already cached
      if (!documentsCache[collectionName]) {
        setLoading(true);
        setError(null);
        try {
          const docs = await getAllDocumentsFromCollection(collectionName);
          setDocumentsCache((prev) => ({
            ...prev,
            [collectionName]: docs,
          }));
        } catch (err) {
          setError(
            `Error loading collection ${collectionName}: ${err.message}`
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    setExpandedCollections(newExpanded);
  };

  const toggleDocument = (collectionName, docId) => {
    const key = `${collectionName}/${docId}`;
    const newExpanded = new Set(expandedDocuments);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedDocuments(newExpanded);
  };

  const toggleSubcollection = async (
    collectionName,
    docId,
    subcollectionName
  ) => {
    const key = `${collectionName}/${docId}/${subcollectionName}`;
    const newExpanded = new Set(expandedSubcollections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
      // Fetch subcollection documents if not cached
      if (!subcollectionsCache[key]) {
        setLoading(true);
        setError(null);
        try {
          const docRef = doc(db, collectionName, docId);
          const subcollectionRef = collection(docRef, subcollectionName);
          const snapshot = await getDocs(subcollectionRef);
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setSubcollectionsCache((prev) => ({
            ...prev,
            [key]: docs,
          }));
        } catch (err) {
          setError(`Error loading subcollection ${key}: ${err.message}`);
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    setExpandedSubcollections(newExpanded);
  };

  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) return;

    if (collections.includes(newCollectionName)) {
      setError(`Collection "${newCollectionName}" already exists in the list.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Try to fetch documents to verify the collection exists
      const docs = await getAllDocumentsFromCollection(newCollectionName);
      setCollections((prev) => [...prev, newCollectionName]);
      setDocumentsCache((prev) => ({
        ...prev,
        [newCollectionName]: docs,
      }));
      setNewCollectionName("");
    } catch (err) {
      setError(
        `Error: Could not access collection "${newCollectionName}". It may not exist or you may not have permission.`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value) => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "object") {
      if (value.seconds && value.nanoseconds) {
        // Timestamp
        return new Date(value.seconds * 1000).toLocaleString();
      }
      if (Array.isArray(value)) {
        return `[${value.length} items]`;
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderDocumentData = (data, indent = 0) => {
    return (
      <div style={{ marginLeft: `${indent * 20}px`, marginTop: "8px" }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "4px" }}>
            <strong>{key}:</strong>{" "}
            <span style={{ color: "#666" }}>
              {typeof value === "object" &&
              !Array.isArray(value) &&
              value !== null ? (
                <div style={{ marginLeft: "20px" }}>
                  {renderDocumentData(value, indent + 1)}
                </div>
              ) : (
                formatValue(value)
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleLoadSubscription = async () => {
    const uid = subscriptionUserId.trim();
    if (!uid) {
      setSubscriptionMessage({ type: "error", text: "Enter a user ID (e.g. email)." });
      return;
    }
    setSubscriptionLoading(true);
    setSubscriptionMessage(null);
    setCurrentLoadedStatus(null);
    try {
      const ref = doc(db, "users", uid, "userSetting", USER_SETTING_DOC_ID);
      const snapshot = await getDoc(ref);
      const data = snapshot.exists() ? snapshot.data() : {};
      const status = data[SUBSCRIPTION_FIELD] ?? null;
      setCurrentLoadedStatus(status);
      setSubscriptionStatus(
        SUBSCRIPTION_STATUSES.includes(status) ? status : SUBSCRIPTION_STATUSES[0]
      );
      setSubscriptionMessage({
        type: "info",
        text: status != null ? `Current: ${status}` : "No subscription set yet.",
      });
    } catch (err) {
      console.error(err);
      setSubscriptionMessage({ type: "error", text: err.message || "Failed to load." });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleSaveSubscription = async () => {
    const uid = subscriptionUserId.trim();
    if (!uid) {
      setSubscriptionMessage({ type: "error", text: "Enter a user ID (e.g. email)." });
      return;
    }
    setSubscriptionLoading(true);
    setSubscriptionMessage(null);
    try {
      const ref = doc(db, "users", uid, "userSetting", USER_SETTING_DOC_ID);
      await setDoc(ref, { [SUBSCRIPTION_FIELD]: subscriptionStatus }, { merge: true });
      setCurrentLoadedStatus(subscriptionStatus);
      setSubscriptionMessage({ type: "success", text: "Subscription status saved." });
    } catch (err) {
      console.error(err);
      setSubscriptionMessage({ type: "error", text: err.message || "Failed to save." });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  return (
    <div
      className="admin-container"
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      <h1>Admin Database Browser</h1>
      <p>Welcome, {user?.email || "Admin"}!</p>

      {/* Add Collection Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="Enter collection name (e.g., 'users', 'admins')"
          style={{
            padding: "8px",
            marginRight: "10px",
            fontSize: "14px",
            width: "300px",
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddCollection();
            }
          }}
        />
        <button
          onClick={handleAddCollection}
          disabled={loading}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {loading ? "Loading..." : "Add Collection"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Subscription Status Tool: users/{userId}/userSetting/settings */}
      <div
        style={{
          border: "2px solid #2196F3",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px",
          backgroundColor: "#f0f8ff",
        }}
      >
        <h2>Subscription Status</h2>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>
          Set user subscription at <code>users/&#123;userId&#125;/userSetting/settings</code> with
          field <code>&quot;subscription status&quot;</code>. Add more statuses in{" "}
          <code>SUBSCRIPTION_STATUSES</code> in admin.js.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end", marginBottom: "12px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            User ID (e.g. email)
            <input
              type="text"
              value={subscriptionUserId}
              onChange={(e) => setSubscriptionUserId(e.target.value)}
              placeholder="user@example.com"
              style={{ padding: "8px", fontSize: "14px", width: "240px" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            Status
            <select
              value={subscriptionStatus}
              onChange={(e) => setSubscriptionStatus(e.target.value)}
              style={{ padding: "8px", fontSize: "14px", minWidth: "120px" }}
            >
              {SUBSCRIPTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleLoadSubscription}
            disabled={subscriptionLoading}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              cursor: subscriptionLoading ? "not-allowed" : "pointer",
              backgroundColor: "#607D8B",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Load current
          </button>
          <button
            type="button"
            onClick={handleSaveSubscription}
            disabled={subscriptionLoading}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              cursor: subscriptionLoading ? "not-allowed" : "pointer",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {subscriptionLoading ? "Saving..." : "Save"}
          </button>
        </div>
        {currentLoadedStatus != null && (
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
            Current in DB: <strong>{currentLoadedStatus}</strong>
          </p>
        )}
        {subscriptionMessage && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor:
                subscriptionMessage.type === "error"
                  ? "#ffebee"
                  : subscriptionMessage.type === "success"
                    ? "#e8f5e9"
                    : "#e3f2fd",
              color:
                subscriptionMessage.type === "error"
                  ? "#c62828"
                  : subscriptionMessage.type === "success"
                    ? "#2e7d32"
                    : "#1565c0",
            }}
          >
            {subscriptionMessage.text}
          </div>
        )}
      </div>

      {/* Data Migration Tool */}
      <div
        style={{
          border: "2px solid #4CAF50",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>🔄 Data Migration Tool</h2>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>
          Convert array fields to map fields. Use index as key and array element
          as value.
          <br />
          <strong>How it works:</strong> Enter the document path (e.g.,{" "}
          <code>users/user@example.com/quizCollection/MyQuiz</code>) and the
          field name inside that document (e.g., <code>quiz</code>). The tool
          will convert the array field to a map field.
        </p>

        {/* Mode Selection */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "15px" }}>
              <input
                type="radio"
                name="migrationMode"
                value="single"
                checked={migrationMode === "single"}
                onChange={(e) => setMigrationMode(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              Single Document
            </label>
            <label style={{ marginRight: "15px" }}>
              <input
                type="radio"
                name="migrationMode"
                value="bulk"
                checked={migrationMode === "bulk"}
                onChange={(e) => setMigrationMode(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              Bulk (Multiple Documents)
            </label>
          </div>
          <div>
            <label style={{ marginRight: "15px" }}>
              <input
                type="radio"
                name="migrationMode"
                value="collection"
                checked={migrationMode === "collection"}
                onChange={(e) => setMigrationMode(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              Collection (All Documents)
            </label>
            <label>
              <input
                type="radio"
                name="migrationMode"
                value="bulkCollections"
                checked={migrationMode === "bulkCollections"}
                onChange={(e) => setMigrationMode(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              Bulk Collections
            </label>
          </div>
        </div>

        {/* Document Path Input */}
        {migrationMode === "single" ? (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Document Path:
            </label>
            <input
              type="text"
              value={singleDocPath}
              onChange={(e) => setSingleDocPath(e.target.value)}
              placeholder="e.g., users/user@example.com/quizCollection/MyQuiz"
              style={{
                padding: "8px",
                fontSize: "14px",
                width: "100%",
                maxWidth: "600px",
              }}
            />
          </div>
        ) : migrationMode === "bulk" ? (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Document Paths (one per line):
            </label>
            <textarea
              value={bulkDocPaths}
              onChange={(e) => setBulkDocPaths(e.target.value)}
              placeholder="users/user1@example.com/quizCollection/Quiz1&#10;users/user2@example.com/quizCollection/Quiz2"
              style={{
                padding: "8px",
                fontSize: "14px",
                width: "100%",
                maxWidth: "600px",
                minHeight: "120px",
                fontFamily: "monospace",
              }}
            />
          </div>
        ) : migrationMode === "collection" ? (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Collection Path:
            </label>
            <input
              type="text"
              value={collectionPath}
              onChange={(e) => setCollectionPath(e.target.value)}
              placeholder="e.g., users/user@example.com/quizCollection"
              style={{
                padding: "8px",
                fontSize: "14px",
                width: "100%",
                maxWidth: "600px",
              }}
            />
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Enter a collection path. All documents in this collection will be
              migrated. Each document must have the specified field name
              (default: <code>quiz</code>).
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Collection Paths (one per line):
            </label>
            <textarea
              value={bulkCollectionPaths}
              onChange={(e) => setBulkCollectionPaths(e.target.value)}
              placeholder="users/user1@example.com/quizCollection&#10;users/user2@example.com/quizCollection&#10;users/user3@example.com/quizCollection"
              style={{
                padding: "8px",
                fontSize: "14px",
                width: "100%",
                maxWidth: "600px",
                minHeight: "120px",
                fontFamily: "monospace",
              }}
            />
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Enter collection paths (one per line). All documents in each
              collection will be migrated. Each document must have the specified
              field name (default: <code>quiz</code>).
            </div>
          </div>
        )}

        {/* Array Field Name Input */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Array Field Name to Convert:
          </label>
          <input
            type="text"
            value={arrayFieldName}
            onChange={(e) => setArrayFieldName(e.target.value)}
            placeholder="e.g., quiz, questions, items"
            style={{
              padding: "8px",
              fontSize: "14px",
              width: "100%",
              maxWidth: "300px",
            }}
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            This is the name of the array field inside the document that will be
            converted to a map.
            <br />
            Example: If your document path is{" "}
            <code>users/user@example.com/quizCollection/MyQuiz</code> and the
            document has a field called <code>quiz</code> (array), enter{" "}
            <code>quiz</code> here.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={async () => {
              setError(null);
              setMigrationPreview(null);
              setMigrationResults(null);

              if (migrationMode === "single") {
                if (!singleDocPath.trim()) {
                  setError("Please enter a document path.");
                  return;
                }
                setMigrating(true);
                try {
                  const preview = await migrateArrayToMap(
                    singleDocPath.trim(),
                    arrayFieldName,
                    { dryRun: true }
                  );
                  setMigrationPreview(preview);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setMigrating(false);
                }
              } else if (migrationMode === "collection") {
                if (!collectionPath.trim()) {
                  setError("Please enter a collection path.");
                  return;
                }
                setMigrating(true);
                setError(null);
                try {
                  // Fetch all documents from the collection
                  const docs = await getAllDocumentsFromCollection(
                    collectionPath.trim()
                  );
                  if (docs.length === 0) {
                    setError(
                      `No documents found in collection: ${collectionPath}`
                    );
                    setMigrating(false);
                    return;
                  }

                  // Build document paths for each document in the collection
                  const docPaths = docs.map((doc) => {
                    // If collectionPath ends with the collection name, append doc.id
                    // Otherwise, it's already a full path
                    if (collectionPath.includes("/")) {
                      return `${collectionPath}/${doc.id}`;
                    } else {
                      return `${collectionPath}/${doc.id}`;
                    }
                  });

                  setMigrationProgress({ current: 0, total: docPaths.length });
                  const results = await bulkMigrateArrayToMap(
                    docPaths,
                    arrayFieldName,
                    {
                      dryRun: true,
                      onProgress: (progress) => {
                        setMigrationProgress(progress);
                      },
                    }
                  );
                  setMigrationPreview(results);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setMigrating(false);
                  setMigrationProgress(null);
                }
              } else {
                // Bulk mode
                if (!bulkDocPaths.trim()) {
                  setError("Please enter document paths.");
                  return;
                }
                const paths = bulkDocPaths
                  .split("\n")
                  .map((p) => p.trim())
                  .filter((p) => p.length > 0);
                if (paths.length === 0) {
                  setError("Please enter at least one valid document path.");
                  return;
                }

                setMigrating(true);
                setMigrationProgress({ current: 0, total: paths.length });
                try {
                  const results = await bulkMigrateArrayToMap(
                    paths,
                    arrayFieldName,
                    {
                      dryRun: true,
                      onProgress: (progress) => {
                        setMigrationProgress(progress);
                      },
                    }
                  );
                  setMigrationPreview(results);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setMigrating(false);
                  setMigrationProgress(null);
                }
              }
            }}
            disabled={migrating}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              marginRight: "10px",
              cursor: migrating ? "not-allowed" : "pointer",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {migrating ? "Previewing..." : "Preview Migration"}
          </button>

          <button
            onClick={async () => {
              if (!migrationPreview) {
                setError("Please preview the migration first.");
                return;
              }

              setError(null);
              setMigrating(true);
              setMigrationResults(null);

              try {
                if (migrationMode === "single") {
                  const result = await migrateArrayToMap(
                    singleDocPath.trim(),
                    arrayFieldName,
                    { dryRun: false, overwrite: true }
                  );
                  setMigrationResults(result);
                  if (result.success) {
                    // Refresh the preview
                    const newPreview = await migrateArrayToMap(
                      singleDocPath.trim(),
                      arrayFieldName,
                      { dryRun: true }
                    );
                    setMigrationPreview(newPreview);
                  }
                } else if (migrationMode === "collection") {
                  // Fetch all documents from the collection again
                  const docs = await getAllDocumentsFromCollection(
                    collectionPath.trim()
                  );
                  const docPaths = docs.map(
                    (doc) => `${collectionPath.trim()}/${doc.id}`
                  );

                  setMigrationProgress({ current: 0, total: docPaths.length });
                  const results = await bulkMigrateArrayToMap(
                    docPaths,
                    arrayFieldName,
                    {
                      dryRun: false,
                      overwrite: true,
                      onProgress: (progress) => {
                        setMigrationProgress(progress);
                      },
                    }
                  );
                  setMigrationResults(results);
                } else if (migrationMode === "bulkCollections") {
                  // Process all collections
                  const collectionPaths = bulkCollectionPaths
                    .split("\n")
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0);

                  // Fetch all documents from all collections
                  const allDocPaths = [];
                  const collectionInfo = [];

                  for (let i = 0; i < collectionPaths.length; i++) {
                    const collPath = collectionPaths[i];
                    setMigrationProgress({
                      current: i + 1,
                      total: collectionPaths.length,
                      message: `Loading ${collPath}...`,
                    });

                    try {
                      const docs =
                        await getAllDocumentsFromCollection(collPath);
                      const docPaths = docs.map(
                        (doc) => `${collPath}/${doc.id}`
                      );
                      allDocPaths.push(...docPaths);
                      collectionInfo.push({
                        path: collPath,
                        documentCount: docs.length,
                      });
                    } catch (err) {
                      console.error(
                        `Error loading collection ${collPath}:`,
                        err
                      );
                    }
                  }

                  if (allDocPaths.length === 0) {
                    setError(
                      "No documents found in any of the specified collections."
                    );
                    setMigrating(false);
                    setMigrationProgress(null);
                    return;
                  }

                  setMigrationProgress({
                    current: 0,
                    total: allDocPaths.length,
                    message: `Migrating ${allDocPaths.length} documents...`,
                  });

                  const results = await bulkMigrateArrayToMap(
                    allDocPaths,
                    arrayFieldName,
                    {
                      dryRun: false,
                      overwrite: true,
                      onProgress: (progress) => {
                        setMigrationProgress(progress);
                      },
                    }
                  );

                  // Add collection info to results
                  results.collectionInfo = collectionInfo;
                  setMigrationResults(results);
                } else {
                  // Bulk mode
                  const paths = bulkDocPaths
                    .split("\n")
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0);

                  setMigrationProgress({ current: 0, total: paths.length });
                  const results = await bulkMigrateArrayToMap(
                    paths,
                    arrayFieldName,
                    {
                      dryRun: false,
                      overwrite: true,
                      onProgress: (progress) => {
                        setMigrationProgress(progress);
                      },
                    }
                  );
                  setMigrationResults(results);
                }
              } catch (err) {
                setError(err.message);
              } finally {
                setMigrating(false);
                setMigrationProgress(null);
              }
            }}
            disabled={!migrationPreview || migrating}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              cursor:
                !migrationPreview || migrating ? "not-allowed" : "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {migrating ? "Migrating..." : "Execute Migration"}
          </button>
        </div>

        {/* Migration Progress */}
        {migrationProgress && (
          <div style={{ marginBottom: "15px" }}>
            {migrationProgress.message && (
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                {migrationProgress.message}
              </div>
            )}
            <div style={{ fontSize: "14px", color: "#666" }}>
              Progress: {migrationProgress.current} / {migrationProgress.total}
            </div>
            <div
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "20px",
                backgroundColor: "#e0e0e0",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  width: `${
                    migrationProgress.total > 0
                      ? (migrationProgress.current / migrationProgress.total) *
                        100
                      : 0
                  }%`,
                  height: "100%",
                  backgroundColor: "#4CAF50",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        )}

        {/* Migration Preview */}
        {migrationPreview && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Preview:</h3>
            {migrationMode === "single" ? (
              <div>
                <p>
                  <strong>Document:</strong> {migrationPreview.docPath}
                </p>
                <p>
                  <strong>Field:</strong> {migrationPreview.arrayFieldName}
                </p>
                <p>
                  <strong>Array Length:</strong> {migrationPreview.itemCount}
                </p>
                <p>
                  <strong>Will convert to:</strong> Map with{" "}
                  {Object.keys(migrationPreview.newValue || {}).length} keys
                </p>
                {migrationPreview.success && (
                  <p style={{ color: "#4CAF50" }}>✓ Ready to migrate</p>
                )}
              </div>
            ) : (
              <div>
                <p>
                  <strong>Total Documents:</strong> {migrationPreview.total}
                </p>
                <p>
                  <strong>Successful:</strong> {migrationPreview.successful}
                </p>
                <p>
                  <strong>Failed:</strong> {migrationPreview.failed}
                </p>
                {migrationPreview.collectionInfo && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Collections:</strong>
                    <ul>
                      {migrationPreview.collectionInfo.map((info, i) => (
                        <li key={i}>
                          {info.path}: {info.documentCount} documents
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {migrationPreview.failed > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Errors:</strong>
                    <ul>
                      {migrationPreview.details
                        .filter((d) => !d.success)
                        .map((d, i) => (
                          <li key={i} style={{ color: "#c62828" }}>
                            {d.docPath}: {d.error}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Migration Results */}
        {migrationResults && (
          <div
            style={{
              padding: "15px",
              backgroundColor: migrationResults.success ? "#e8f5e9" : "#ffebee",
              border: `1px solid ${
                migrationResults.success ? "#4CAF50" : "#c62828"
              }`,
              borderRadius: "4px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {migrationResults.success
                ? "✓ Migration Complete!"
                : "✗ Migration Failed"}
            </h3>
            {migrationMode === "single" ? (
              <div>
                <p>
                  <strong>Document:</strong> {migrationResults.docPath}
                </p>
                {migrationResults.success && (
                  <p>Migrated {migrationResults.originalCount} items to map.</p>
                )}
                {migrationResults.error && (
                  <p style={{ color: "#c62828" }}>
                    Error: {migrationResults.error}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p>
                  <strong>Total:</strong> {migrationResults.total} documents
                </p>
                <p>
                  <strong>Successful:</strong> {migrationResults.successful}
                </p>
                <p>
                  <strong>Failed:</strong> {migrationResults.failed}
                </p>
                {migrationResults.collectionInfo && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Collections Processed:</strong>
                    <ul>
                      {migrationResults.collectionInfo.map((info, i) => (
                        <li key={i}>
                          {info.path}: {info.documentCount} documents
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {migrationResults.failed > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Failed Documents:</strong>
                    <ul>
                      {migrationResults.details
                        .filter((d) => !d.success)
                        .map((d, i) => (
                          <li key={i}>
                            {d.docPath}: {d.error}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collections List */}
      <div>
        <h2>Collections</h2>
        {collections.map((collectionName) => (
          <div
            key={collectionName}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "8px",
            }}
          >
            <div
              onClick={() => toggleCollection(collectionName)}
              style={{
                padding: "12px",
                backgroundColor: expandedCollections.has(collectionName)
                  ? "#f5f5f5"
                  : "#fff",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>
                📁 {collectionName}
                {documentsCache[collectionName] &&
                  ` (${documentsCache[collectionName].length} documents)`}
              </strong>
              <span>{expandedCollections.has(collectionName) ? "▼" : "▶"}</span>
            </div>

            {expandedCollections.has(collectionName) && (
              <div style={{ padding: "12px", backgroundColor: "#fafafa" }}>
                {loading && !documentsCache[collectionName] ? (
                  <div>Loading documents...</div>
                ) : documentsCache[collectionName]?.length === 0 ? (
                  <div style={{ color: "#666" }}>
                    No documents in this collection
                  </div>
                ) : (
                  documentsCache[collectionName]?.map((document) => {
                    const docKey = `${collectionName}/${document.id}`;
                    const isExpanded = expandedDocuments.has(docKey);
                    const knownSubs =
                      KNOWN_SUBCOLLECTIONS[collectionName] || [];

                    return (
                      <div
                        key={document.id}
                        style={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          marginBottom: "8px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <div
                          onClick={() =>
                            toggleDocument(collectionName, document.id)
                          }
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: isExpanded ? "#f9f9f9" : "#fff",
                          }}
                        >
                          <strong>📄 {document.id}</strong>
                          <span>{isExpanded ? "▼" : "▶"}</span>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: "12px" }}>
                            {/* Document Data */}
                            <div style={{ marginBottom: "12px" }}>
                              <strong>Data:</strong>
                              <div
                                style={{
                                  marginTop: "8px",
                                  padding: "10px",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "4px",
                                  fontFamily: "monospace",
                                  fontSize: "12px",
                                  maxHeight: "400px",
                                  overflow: "auto",
                                }}
                              >
                                {renderDocumentData(document.data)}
                              </div>
                            </div>

                            {/* Subcollections */}
                            {knownSubs.length > 0 && (
                              <div>
                                <strong>Subcollections:</strong>
                                {knownSubs.map((subName) => {
                                  const subKey = `${collectionName}/${document.id}/${subName}`;
                                  const isSubExpanded =
                                    expandedSubcollections.has(subKey);
                                  const subDocs =
                                    subcollectionsCache[subKey] || [];

                                  return (
                                    <div
                                      key={subName}
                                      style={{
                                        marginTop: "8px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      <div
                                        onClick={() =>
                                          toggleSubcollection(
                                            collectionName,
                                            document.id,
                                            subName
                                          )
                                        }
                                        style={{
                                          padding: "8px",
                                          cursor: "pointer",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          backgroundColor: isSubExpanded
                                            ? "#f5f5f5"
                                            : "#fff",
                                        }}
                                      >
                                        <span>
                                          📂 {subName}
                                          {subDocs.length > 0 &&
                                            ` (${subDocs.length} documents)`}
                                        </span>
                                        <span>{isSubExpanded ? "▼" : "▶"}</span>
                                      </div>

                                      {isSubExpanded && (
                                        <div style={{ padding: "8px" }}>
                                          {loading &&
                                          !subcollectionsCache[subKey] ? (
                                            <div>Loading...</div>
                                          ) : subDocs.length === 0 ? (
                                            <div style={{ color: "#666" }}>
                                              No documents
                                            </div>
                                          ) : (
                                            subDocs.map((subDoc) => (
                                              <div
                                                key={subDoc.id}
                                                style={{
                                                  padding: "8px",
                                                  marginTop: "4px",
                                                  backgroundColor: "#fff",
                                                  border: "1px solid #e0e0e0",
                                                  borderRadius: "4px",
                                                }}
                                              >
                                                <strong>📄 {subDoc.id}</strong>
                                                <div
                                                  style={{
                                                    marginTop: "4px",
                                                    padding: "8px",
                                                    backgroundColor: "#f9f9f9",
                                                    borderRadius: "4px",
                                                    fontFamily: "monospace",
                                                    fontSize: "11px",
                                                  }}
                                                >
                                                  {renderDocumentData(
                                                    subDoc.data,
                                                    1
                                                  )}
                                                </div>
                                              </div>
                                            ))
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

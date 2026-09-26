import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

if (window.location.hash.startsWith("#/")) {
  window.history.replaceState(null, "", window.location.hash.slice(1) || "/");
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

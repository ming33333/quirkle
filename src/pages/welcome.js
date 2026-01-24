import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBookOpen,
  faChartLine,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const Welcome = ({ user }) => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "salmon",
    },
    header: {
      padding: "1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    headerText: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#1F2937",
      margin: 0,
    },
    headerEmail: {
      fontSize: "0.875rem",
      color: "#4B5563",
    },
    main: {
      maxWidth: "56rem",
      margin: "0 auto",
      padding: "1.5rem 1.5rem 3rem 1.5rem",
    },
    welcomeSection: {
      textAlign: "center",
      marginBottom: "3rem",
    },
    welcomeBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: "#FFF4E6",
      color: "#C2410C",
      padding: "0.5rem 1rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "500",
      marginBottom: "1.5rem",
    },
    welcomeHeading: {
      fontSize: "2.25rem",
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: "1rem",
      margin: "0 0 1rem 0",
    },
    welcomeText: {
      fontSize: "1.125rem",
      color: "#FFFFFF",
      marginBottom: "2rem",
      maxWidth: "32rem",
      margin: "0 auto 2rem auto",
    },
    dashboardButton: {
      background: "linear-gradient(to right, #FB923C, #F472B6, #FB7185)",
      color: "white",
      border: "none",
      borderRadius: "9999px",
      padding: "1.5rem 2rem",
      fontSize: "1.125rem",
      fontWeight: "500",
      cursor: "pointer",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
      marginBottom: "3rem",
    },
    featureCard: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(4px)",
      borderRadius: "1.5rem",
      padding: "1.5rem",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      transition: "box-shadow 0.3s ease",
      border: "1px solid rgba(255, 192, 203, 0.5)",
    },
    featureIconContainer: {
      width: "3rem",
      height: "3rem",
      background: "linear-gradient(to bottom right, #FB923C, #EC4899)",
      borderRadius: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    featureIcon: {
      width: "1.5rem",
      height: "1.5rem",
      color: "white",
    },
    featureTitle: {
      fontWeight: "600",
      color: "#111827",
      marginBottom: "0.5rem",
      fontSize: "1rem",
    },
    featureDescription: {
      fontSize: "0.875rem",
      color: "#4B5563",
      margin: 0,
    },
    quickStartCard: {
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(4px)",
      borderRadius: "1.5rem",
      padding: "2rem",
      border: "1px solid rgba(255, 192, 203, 0.5)",
    },
    quickStartTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    quickStartGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
    },
    quickStartItem: {
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: "1.5rem",
      textAlign: "center",
      cursor: "pointer",
      border: "1px solid #F3F4F6",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      position: "relative",
    },
    quickStartItemHover: {
      transform: "scale(1.05)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    quickStartEmoji: {
      fontSize: "1.875rem",
      marginBottom: "0.5rem",
    },
    quickStartQuestion: {
      fontWeight: "500",
      color: "#111827",
      marginBottom: "0.5rem",
      fontSize: "1rem",
    },
    expandedContent: {
      fontSize: "0.875rem",
      color: "#4B5563",
      marginTop: "0.75rem",
      paddingTop: "0.75rem",
      borderTop: "1px solid #E5E7EB",
    },
    footer: {
      textAlign: "center",
      padding: "2rem",
      fontSize: "0.875rem",
      color: "#FFFFFF",
    },
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTitle}></div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          {user ? (
            <>
              <h2 style={styles.welcomeHeading}>Welcome back! Ready to learn something new?</h2>
              <p style={styles.welcomeText}>
                Your learning journey continues. Stay consistent, stay curious! 🌟
              </p>
            </>
          ) : (
            <>
              <h2 style={styles.welcomeHeading}>Welcome! Start your learning journey today</h2>
              <p style={styles.welcomeText}>
                Sign in to access personalized flashcards, track your progress, and master new concepts! 🚀
              </p>
            </>
          )}

          <button
            onClick={handleDashboardClick}
            style={styles.dashboardButton}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(to right, #F97316, #EC4899, #F43F5E)";
              e.target.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(to right, #FB923C, #F472B6, #FB7185)";
              e.target.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
            }}
          >
            {user ? "Go to Dashboard →" : "Get Started →"}
          </button>
        </div>

        {/* Features Grid */}
        <div style={styles.featuresGrid}>
          <div
            style={styles.featureCard}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div style={styles.featureIconContainer}>
              <FontAwesomeIcon icon={faBookOpen} style={styles.featureIcon} />
            </div>
            <h3 style={styles.featureTitle}>Interactive Flashcards</h3>
            <p style={styles.featureDescription}>
              Master concepts with smart flashcards
            </p>
          </div>

          <div
            style={{
              ...styles.featureCard,
              border: "1px solid rgba(244, 114, 182, 0.5)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div
              style={{
                ...styles.featureIconContainer,
                background:
                  "linear-gradient(to bottom right, #EC4899, #F43F5E)",
              }}
            >
              <FontAwesomeIcon icon={faChartLine} style={styles.featureIcon} />
            </div>
            <h3 style={styles.featureTitle}>Track Progress</h3>
            <p style={styles.featureDescription}>
              Stay motivated with visual insights
            </p>
          </div>

          <div
            style={{
              ...styles.featureCard,
              border: "1px solid rgba(167, 139, 250, 0.5)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div
              style={{
                ...styles.featureIconContainer,
                background:
                  "linear-gradient(to bottom right, #F43F5E, #A78BFA)",
              }}
            >
              <FontAwesomeIcon icon={faStar} style={styles.featureIcon} />
            </div>
            <h3 style={styles.featureTitle}>Personalized Learning</h3>
            <p style={styles.featureDescription}>
              Study tools adapted to your pace
            </p>
          </div>
        </div>

        {/* Quick Start Cards */}
        <div style={styles.quickStartCard}>
          <h3 style={styles.quickStartTitle}>Quick Start</h3>
          <div style={styles.quickStartGrid}>
            <div
              onClick={() => toggleCard(0)}
              style={{
                ...styles.quickStartItem,
                ...(expandedCard === 0 ? styles.quickStartItemHover : {}),
              }}
              onMouseEnter={(e) => {
                if (expandedCard !== 0) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (expandedCard !== 0) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <div style={styles.quickStartEmoji}>⚛️</div>
              <p style={styles.quickStartQuestion}>What is React?</p>
              {expandedCard === 0 && (
                <div
                  style={{
                    ...styles.expandedContent,
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <p>
                    React is a JavaScript library for building user interfaces,
                    particularly single-page applications with reusable
                    components.
                  </p>
                </div>
              )}
            </div>

            <div
              onClick={() => toggleCard(1)}
              style={{
                ...styles.quickStartItem,
                ...(expandedCard === 1 ? styles.quickStartItemHover : {}),
              }}
              onMouseEnter={(e) => {
                if (expandedCard !== 1) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (expandedCard !== 1) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <div style={styles.quickStartEmoji}>🧩</div>
              <p style={styles.quickStartQuestion}>What is a component?</p>
              {expandedCard === 1 && (
                <div
                  style={{
                    ...styles.expandedContent,
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <p>
                    A component is a reusable, self-contained piece of code that
                    returns HTML elements. It's the building block of React
                    apps.
                  </p>
                </div>
              )}
            </div>

            <div
              onClick={() => toggleCard(2)}
              style={{
                ...styles.quickStartItem,
                ...(expandedCard === 2 ? styles.quickStartItemHover : {}),
              }}
              onMouseEnter={(e) => {
                if (expandedCard !== 2) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (expandedCard !== 2) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <div style={styles.quickStartEmoji}>📦</div>
              <p style={styles.quickStartQuestion}>What is JSX?</p>
              {expandedCard === 2 && (
                <div
                  style={{
                    ...styles.expandedContent,
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <p>
                    JSX is a syntax extension for JavaScript that lets you write
                    HTML-like code in your JavaScript files. React transforms it
                    to regular JavaScript.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Consistency is key. Let's make today count! 💪</p>
      </footer>
    </div>
  );
};

export default Welcome;

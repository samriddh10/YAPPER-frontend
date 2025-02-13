import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ScrollLinked from "./jsx/ScrollLinked"; // Import ScrollLinked component
import "./App.css";

function App() {
  const [text, setText] = useState(""); // Holds typed text
  const [animationStart, setAnimationStart] = useState(false); // Controls animations
  const [showButtons, setShowButtons] = useState(false); // Controls button appearance
  const navigate = useNavigate(); // Hook for navigation

  const fullText = "Yaapper.com"; // Text to display
  const typingSpeed = 150; // Speed of typing in ms

  useEffect(() => {
    let index = 0;
    setText(""); // Reset text before animation starts

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setAnimationStart(true); // Start animations after typing

        // Delay buttons appearance slightly after animation
        setTimeout(() => {
          setShowButtons(true);
        }, 800);
      }
    }, typingSpeed);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []); // Runs only once

  return (
    <div className="app-container">
      {/* Typing Effect + Moving Animation */}
      <motion.h1
        className={`typewriter ${animationStart ? "move-animation" : ""}`}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={animationStart ? { x: "-25vh", y: "-25vh", scale: 0.8 } : {}}
        transition={{ type: "tween", duration: 1 }}
      >
        {text}
        <span className="cursor">|</span>
      </motion.h1>

      {/* Sign In & Login Buttons */}
      {showButtons && (
        <motion.div
          className="button-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button className="auth-button" onClick={() => navigate("/signup")}>Sign In</button>
          <button className="auth-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </motion.div>
      )}

      {/* ScrollLinked Sliding in from the Right */}
      {animationStart && (
        <motion.div
          className="scroll-container"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween", duration: 1 }}
        >
          <ScrollLinked />
        </motion.div>
      )}
    </div>
  );
}

export default App;

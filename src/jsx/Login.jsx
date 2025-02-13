import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase"; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import "./css/Login.css"; // Import CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home"); // Redirect to Home if already logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("token", user.accessToken); // Store token in localStorage
      navigate("/home"); // Redirect to Home
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg">
      <div className="login-container">
        <motion.div
          className="login-box"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="login-title">Yapper.com</h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <motion.button
              type="submit"
              className="login-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </form>

          <p className="login-footer" onClick={() => navigate("/signup")}>
            Don't have an account? Sign Up
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
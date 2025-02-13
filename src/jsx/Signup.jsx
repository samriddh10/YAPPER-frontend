import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase"; // Import Firebase auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./css/Signup.css"; // Import CSS file
import React from "react";
import { db } from "../firebase"; // Import Firestore
import { collection, doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Firebase Authentication: Create a new user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user's display name
      await updateProfile(user, { displayName: name });

      

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
      });
      console.log("User created:", user);

      // Optionally store the token in local storage
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      alert("Account created successfully!");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg">
      <div className="signup-container">
        <motion.div
          className="signup-box"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="signup-title">Join Yapper.com</h2>

          <form onSubmit={handleSignup} className="signup-form">
            {error && <p className="error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="signup-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
              required
            />
            <motion.button
              type="submit"
              className="signup-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </form>

          <p className="signup-footer" onClick={() => navigate("/login")}>
            Already have an account? Login
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

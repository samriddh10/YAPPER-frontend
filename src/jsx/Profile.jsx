import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./css/Profile.css";
import Header from "./Header";
import defaultAvatar from "../assets/default_icon.png"; // Default avatar
import React from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState(defaultAvatar);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  // Dark mode state with persistence
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Apply dark mode when component mounts
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Fetch user details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setPhotoURL(userDocSnap.data().photoURL || defaultAvatar);
        } else {
          setPhotoURL(currentUser.photoURL || defaultAvatar);
        }
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [auth, navigate, db]);

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Handle Profile Picture Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("userId", auth.currentUser.uid);

    try {
      const response = await fetch("https://yapper-backend-zeta.vercel.app/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload");
      }

      // Update Firestore with new photo URL
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { photoURL: data.url }, { merge: true });

      // Update Firebase Auth Profile
      await updateProfile(auth.currentUser, { photoURL: data.url });

      setPhotoURL(data.url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Handle Dark Mode Toggle
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  return (
    <div className="profile-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <Header />

      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">
            Hello, {user?.displayName || "User"}
          </h2>

          {/* Profile Picture */}
          <label htmlFor="file-upload">
            <img
              src={photoURL}
              alt="User Avatar"
              className="profile-avatar"
              style={{ cursor: "pointer" }}
            />
          </label>
          <input
            id="file-upload"
            type="file"
            className="file-input"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        {user ? (
          <div className="profile-details">
            <p>
              <strong>Username:</strong> {user.displayName || "Not provided"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            {/* Dark Mode Toggle */}
            <h3 className="settings-title">Settings</h3>
            <div className="settings">
              <div className="theme-toggle">
                <span>Theme</span>
                <button
                  className="toggle-container"
                  onClick={toggleDarkMode}
                  style={{
                    justifyContent: isDarkMode ? "flex-start" : "flex-end",
                  }}
                >
                  <motion.div
                    className="toggle-handle"
                    layout
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      bounce: 0.2,
                    }}
                  />
                </button>
              </div>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <p className="loading-text">Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
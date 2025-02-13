import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./jsx/Login"; // Import Login Page
import ProtectedRoute from "./auth/ProtectedRoute";
import Signup from "./jsx/Signup";
import Home from "./jsx/Home";
import Logout from "./jsx/Logout";
import Profile from "./jsx/Profile";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
      <Route path= "/signup" element={<Signup />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
);

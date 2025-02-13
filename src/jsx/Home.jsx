import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { getMessages, sendMessage } from "../services/ChatService";
import Picker from "emoji-picker-react"; // Emoji Picker
import "./css/Home.css";
import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import defaultAvatar from "../assets/default_icon.png";

const Home = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false); // Emoji Picker
  const [showOptions, setShowOptions] = useState(null); // Dropdown for delete
  const [showDeleteMenu, setShowDeleteMenu] = useState(null); // Confirmation menu

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    // Retrieve dark mode state from localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((userData) => userData.email !== user?.email);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleChatSelect = (chatUser) => {
    setSelectedChat(chatUser);
    getMessages(user.email, chatUser.email, setMessages);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      await sendMessage(user.email, selectedChat.email, newMessage);
      setNewMessage("");
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      
      if (newMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
  
      return newMode;
    });
  };
  

  // Delete Message
  const handleDeleteMessage = async (messageId, deleteForEveryone) => {
    const messageRef = doc(db, "chats", messageId);
    try {
      if (deleteForEveryone) {
        await updateDoc(messageRef, { deleted: true }); // Delete for Everyone
      } else {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId)); // Delete for sender only
      }
      setShowDeleteMenu(null); // Close delete menu
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div>
      <Header />
      <Navbar />

      <div className="home-container">
        {/* Left Sidebar - Users List */}
        <div className="sidebar">
          <h2>Available Users</h2>
          <ul>
            {users.map((chatUser, index) => (
              <li key={index} onClick={() => handleChatSelect(chatUser)}>
                <span className="user-name">{chatUser.name}</span> <br />
                <span className="user-email">{chatUser.email}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <img
                  src={selectedChat.photoURL || defaultAvatar}
                  alt="User Avatar"
                  className="chat-user-avatar"
                />
                <div>
                  <span className="chat-user-name">{selectedChat.name}</span>{" "}
                  <br />
                  <span className="chat-user-email">{selectedChat.email}</span>
                </div>
              </div>
              <div className={`chat-messages ${darkMode ? "dark-mode" : ""}`}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={
                      msg.sender === user.email ? "my-message" : "their-message"
                    }
                  >
                    {msg.deleted ? (
                      <p className="deleted-message">
                        🚫 This message was deleted.
                      </p>
                    ) : (
                      <>
                        <p>{msg.message}</p>
                        {msg.sender === user.email && (
                          <div className="message-options" ref={dropdownRef}>
                            <button
                              className="options-btn"
                              onClick={() =>
                                setShowOptions(showOptions === index ? null : index)
                              }
                            >
                              ⋮
                            </button>
                            {showOptions === index && (
                              <div className="dropdown-menu">
                                <button onClick={() => setShowDeleteMenu(index)}>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Delete Confirmation Menu */}
                    {showDeleteMenu === index && (
                      <div className="delete-menu">
                        <p>Are you sure you want to delete this message?</p>
                        <button
                          className="delete-everyone"
                          onClick={() => handleDeleteMessage(msg.id, true)}
                        >
                          Delete for Everyone
                        </button>
                        <button
                          className="delete-me"
                          onClick={() => handleDeleteMessage(msg.id, false)}
                        >
                          Delete for Me
                        </button>
                        <button
                          className="cancel"
                          onClick={() => setShowDeleteMenu(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={`chat-input ${darkMode ? "dark-mode" : ""}`}>
                <button
                  className="emoji-button"
                  onClick={() => setShowPicker(!showPicker)}
                >
                  😀
                </button>
                {showPicker && (
                  <div className="emoji-picker">
                    <Picker onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              Select a user to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
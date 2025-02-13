import { db } from "../firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import React from "react";

// Get real-time messages for a chat
export const getMessages = (user1, user2, setMessages) => {
  const chatId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  const messagesRef = collection(db, "chats");

  const q = query(
    messagesRef,
    where("chatId", "==", chatId),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    setMessages(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      message: doc.data().deleted ? "This message was deleted." : doc.data().message
    })));
  });
};


// Send a message
export const sendMessage = async (user1, user2, message) => {
  const chatId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  try {
    await addDoc(collection(db, "chats"), {
      chatId,
      sender: user1,
      receiver: user2,
      message,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};

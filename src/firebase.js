import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase config (Replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyAW-mTvnnxC5n8SQiRZsW4U20LLch9_tCE",
    authDomain: "yapperdotcom.firebaseapp.com",
    projectId: "yapperdotcom",
    storageBucket: "yapperdotcom.firebasestorage.app",
    messagingSenderId: "974542583123",
    appId: "1:974542583123:web:1f31f88e94a19819e49da6",
    measurementId: "G-5Z31WT1QM2"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export { createUserWithEmailAndPassword, updateProfile };
export {db };

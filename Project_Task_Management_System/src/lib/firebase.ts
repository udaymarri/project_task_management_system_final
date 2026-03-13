import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdW85ogHqGxsIzS2ZvOPOi6HtR-E2x214",
  authDomain: "project-managemant-system.firebaseapp.com",
  projectId: "project-managemant-system",
  storageBucket: "project-managemant-system.firebasestorage.app",
  messagingSenderId: "181961693506",
  appId: "1:181961693506:web:b9a9a7b1ebfa1da4e910db",
  measurementId: "G-J7T3C1KFWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };

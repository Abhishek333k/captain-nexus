import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config – replace with your own values if needed
const firebaseConfig = {
  apiKey: "AIzaSyBhhjIlrM4TtnRBLtKY-ACRTRGuCggU1BI",
  authDomain: "silenvault-ops.firebaseapp.com",
  projectId: "silenvault-ops",
  storageBucket: "silenvault-ops.firebasestorage.app",
  messagingSenderId: "414237928741",
  appId: "1:414237928741:web:f9954e30c35715da823ecc",
  measurementId: "G-NF5PRELBVG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxN08IWAyjIubCUJoOL8l5g88-hp0IuX8",
  authDomain: "myroad-80999.firebaseapp.com",
  projectId: "myroad-80999",
  storageBucket: "myroad-80999.firebasestorage.app",
  messagingSenderId: "426579556372",
  appId: "1:426579556372:web:c9526370100c193e7a0f01"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

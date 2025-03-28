import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbJlMdmwe55A31FhUO4J3nWb9oGgj-h94",
  authDomain: "learnxchange-80eac.firebaseapp.com",
  projectId: "learnxchange-80eac",
  storageBucket: "learnxchange-80eac.firebasestorage.app",
  messagingSenderId: "499721532082",
  appId: "1:499721532082:web:ef3ee1ec9263a31b7c8fab",
  measurementId: "G-L3HQ5FCCYY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); 
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2gE-nkPsDham8S6YOwdU0GsFpwKhpixU",
  authDomain: "iacontabil.firebaseapp.com",
  projectId: "iacontabil",
  storageBucket: "iacontabil.firebasestorage.app",
  messagingSenderId: "640165711913",
  appId: "1:640165711913:web:2c15d7a636308e97dc4c38",
  measurementId: "G-LBC81T54YT"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithEmail = signInWithEmailAndPassword;
export const signInWithGooglePopup = signInWithPopup;
export const db = getFirestore(app);
export const storage = getStorage(app);

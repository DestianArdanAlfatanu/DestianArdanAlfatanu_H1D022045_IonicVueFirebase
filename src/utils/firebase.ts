import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDU-w6tvbjNxgQ-MirYUPTRVmWvWmI50rA",
    authDomain: "fatan-firebase-e7778.firebaseapp.com",
    projectId: "fatan-firebase-e7778",
    storageBucket: "fatan-firebase-e7778.firebasestorage.app",
    messagingSenderId: "466997294826",
    appId: "1:466997294826:web:6cf8eed78155245b2ac993",
    measurementId: "G-9J09J8G924"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
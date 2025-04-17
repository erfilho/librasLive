import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAMhNE1vyZeQeXB7_kj9tKxuoWI5Ct2M8",
  authDomain: "libras-live.firebaseapp.com",
  projectId: "libras-live",
  storageBucket: "libras-live.firebasestorage.app",
  messagingSenderId: "931600847933",
  appId: "1:931600847933:web:4cad98565b4caa6f6d8654",
  measurementId: "G-L8P0M45M8K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNp6pob7qLHgBf-Jc-tONLILxdR-zGhwQ",
  authDomain: "e-labo-proje.firebaseapp.com",
  projectId: "e-labo-proje",
  storageBucket: "e-labo-proje.firebasestorage.app",
  messagingSenderId: "1073158315840",
  appId: "1:1073158315840:web:70a65cba8f1c9634b824a5",
  measurementId: "G-8QYS5Z9XFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
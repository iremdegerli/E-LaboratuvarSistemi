// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdOPMDr8B27V2rEIvCsvKZXiTL_MasbhA",
  authDomain: "e-lab-14c22.firebaseapp.com",
  projectId: "e-lab-14c22",
  storageBucket: "e-lab-14c22.firebasestorage.app",
  messagingSenderId: "512367726048",
  appId: "1:512367726048:web:8ce1022ecb130b1c96ef85",
  measurementId: "G-RE9EPV8KLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
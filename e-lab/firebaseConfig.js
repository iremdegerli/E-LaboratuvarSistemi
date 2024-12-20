import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDx4QuIoHJRgxIvOsVoyj9ZTP8PwZPzxpg",
  authDomain: "e-laboratuvar-d4f29.firebaseapp.com",
  projectId: "e-laboratuvar-d4f29",
  storageBucket: "e-laboratuvar-d4f29.firebasestorage.app",
  messagingSenderId: "186458308230",
  appId: "1:186458308230:web:751f070d45d220a86c9b07",
  measurementId: "G-6EP9WYGF1C"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getFirestore(app);
export const auth = getAuth(app);
export default app;
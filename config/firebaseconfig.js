// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "groceryglide-47d21.firebaseapp.com",
  projectId: "groceryglide-47d21",
  storageBucket: "groceryglide-47d21.appspot.com",
  messagingSenderId: "733383608326",
  appId: "1:733383608326:web:4d35b5a7cbb38ee7275b87",
  measurementId: "G-4D2FQKGGWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
// const analytics = getAnalytics(app);

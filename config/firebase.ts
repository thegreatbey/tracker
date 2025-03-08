// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAne4ffRJVxGdG_2YIYz1r-TbMZTC2RgU4",
  authDomain: "tracker-644bf.firebaseapp.com",
  projectId: "tracker-644bf",
  storageBucket: "tracker-644bf.firebasestorage.app",
  messagingSenderId: "685469910784",
  appId: "1:685469910784:web:de1da168dff7c17e9955e5",
  measurementId: "G-BTFQM8XSY5"
};

console.log('Initializing Firebase with config:', { ...firebaseConfig, apiKey: '***' });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized');

//const analytics = getAnalytics(app);
const firestore = getFirestore(app);
console.log('Firestore initialized');

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
console.log('Auth initialized');

export { auth, firestore };
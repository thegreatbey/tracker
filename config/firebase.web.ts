import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import Constants from 'expo-constants';

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

const firestore = getFirestore(app);
console.log('Firestore initialized');

// Initialize Firebase Authentication with browser persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
console.log('Auth initialized with browser persistence');

export { auth, firestore }; 
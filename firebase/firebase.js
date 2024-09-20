import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
   browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5i_jimen4rJFfVrQ6P3-jlvNwg9ZUnoA",
  authDomain: "hackathon-422b4.firebaseapp.com",
  projectId: "hackathon-422b4",
  storageBucket: "hackathon-422b4.appspot.com",
  messagingSenderId: "253730224450",
  appId: "1:253730224450:web:137a3b8bf381c15574b0db",
  measurementId: "G-YESEJ1RF0H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  signInWithEmailAndPassword,
  getDoc,
  getDocs,
  collection,
  addDoc,
  onAuthStateChanged,
  signOut,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  query,
  where,
  updateDoc,
  setPersistence,
   browserLocalPersistence,
   onSnapshot
};

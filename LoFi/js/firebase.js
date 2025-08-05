// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4ecY0RtIE4cTW3jYIUyTNgkRnvPjZ_FA",
  authDomain: "lofitapes-bb9c1.firebaseapp.com",
  projectId: "lofitapes-bb9c1",
  storageBucket: "lofitapes-bb9c1.appspot.com",
  messagingSenderId: "43757876323",
  appId: "1:43757876323:web:8df13356e73a89980d7456",
  measurementId: "G-0EN4NF1645",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
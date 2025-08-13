// js/auth.js
import { auth, provider } from "./firebase.js";
import {
  signInWithPopup, signInAnonymously,
  createUserWithEmailAndPassword, signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let onAuthCallback = () => {};

export function subscribeAuth(cb) {
  onAuthCallback = cb;
  onAuthStateChanged(auth, cb);
}

export function login() {
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

export function register(email, pass) {
  return createUserWithEmailAndPassword(auth, email, pass);
}

export function loginAnon() {
  return signInAnonymously(auth);
}
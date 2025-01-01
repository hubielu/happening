import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDPypZ4f_JTZWI0KqNiDrXIJgaPYAX1Bk0",
  authDomain: "network-insider.firebaseapp.com",
  projectId: "network-insider",
  storageBucket: "network-insider.firebasestorage.app",
  messagingSenderId: "713387734710",
  appId: "1:713387734710:web:ad51e1961068844dfe1817",
  measurementId: "G-94J4S907ZY"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };

const admin = require('firebase-admin');

// Replace this with the path to your Firebase service account key file
const serviceAccount = require('/Users/hubert/Downloads/network-insider-firebase-adminsdk-4axco-ce029cd370.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://network-insider.firebaseio.com',
});

module.exports = admin;
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



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
export const db = getFirestore(app);
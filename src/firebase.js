// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAJr-c8FOGIvJ5nEHQDv2dIcpJtJb8oewY",
    authDomain: "prvykviz.firebaseapp.com",
    projectId: "prvykviz",
    storageBucket: "prvykviz.appspot.com",
    messagingSenderId: "410959348669",
    appId: "1:410959348669:web:1be8ed05671b5b065208d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)
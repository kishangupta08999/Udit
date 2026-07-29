import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBphbnP1ZnxDezX4TA53VGjoFsK-_D8bMI",
    authDomain: "udit-4508a.firebaseapp.com",
    projectId: "udit-4508a",
    storageBucket: "udit-4508a.firebasestorage.app",
    messagingSenderId: "1053860432324",
    appId: "1:1053860432324:web:5c22ba1bceeb6de6513c91"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, doc, getDoc, setDoc };
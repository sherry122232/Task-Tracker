// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4TQmu68j2kjmsp8y-96G0Y2bnXlnzwUo",
  authDomain: "task-tracker-7deb9.firebaseapp.com",
  projectId: "task-tracker-7deb9",
  storageBucket: "task-tracker-7deb9.appspot.com",
  messagingSenderId: "293093971731",
  appId: "1:293093971731:web:faa311f8331312d0982ce6",
  measurementId: "G-JYJR1VMXH4"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
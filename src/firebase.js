// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth ,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8g7oWEpCeReryikEHjTg6XhrNs5rsq9U",
  authDomain: "review-app-1b5b8.firebaseapp.com",
  projectId: "review-app-1b5b8",
  storageBucket: "review-app-1b5b8.appspot.com",
  messagingSenderId: "409974560181",
  appId: "1:409974560181:web:c6a3a7af45f285a11275fc",
  measurementId: "G-ZK0S2C8MQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider}
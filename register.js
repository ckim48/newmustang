import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD94n16QHw9FiojIo4xW16yHQl4TzXMpWU",
    authDomain: "mustang-makeover-2fb63.firebaseapp.com",
    projectId: "mustang-makeover-2fb63",
    storageBucket: "mustang-makeover-2fb63.appspot.com",
    messagingSenderId: "248652842072",
    appId: "1:248652842072:web:82858b0b05e7b39daef62d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const db = firebase.firestore();
const storage = getStorage();
const db = getFirestore();
const auth = getAuth(app);
document.querySelector("#register").addEventListener("click", function () {
    const firstName = document.querySelector("#first-name-new").value;
    const lastName = document.querySelector("#last-name-new").value;
    const email = document.querySelector("#email-new").value;
    const grade = document.querySelector("#grade-new").value;
    const pass = document.querySelector("#pw-new").value;
    const confirmPass = document.querySelector("#confirm-pw-new").value;

    if(firstName == "")
    {
        alert("Please input your first name.");
        return;
    }
    else if(lastName == "")
    {
        alert("Please input your last name.");
        return;
    }
    else if(email == "")
    {
        alert("Please input your email.")
        return;
    }
    else if(grade == "")
    {
        alert("Please input your grade.")
        return;
    }
    else if(pass == "")
    {
        alert("Please input your password.")
        return;
    }
    else if(pass !== confirmPass)
    {
        alert("Password does not match.")
        return;
    }

    createUserWithEmailAndPassword(auth, email, pass)
        .then(async (userCredential) => {
            const user = userCredential.user;
            // create firebase
            const userRef = doc(db, "users", email);
            await setDoc(userRef, {
                points: 0,
                firstName: firstName,
                lastName: lastName,
                email: email,
                grade: grade
            });
            window.location.href = "index.html";
            console.log("Signed up Succesfully!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == "auth/email-already-in-use") {
                alert("Email is already used.");
            } else if (errorCode == "auth/invalid-email") {
                alert("Email format is not correct.");
            } else if (errorCode == "auth/weak-password") {
                alert("Password is too weak.");
            }
            // ..
        });
});

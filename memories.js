// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
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
  limit,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    document.getElementById('navbar-login').style.display = "none";
    document.getElementById('navbar-logout').style.display = "block";
    console.log(user.email)
    if(user.email == "admin@admin.com")
    {
      document.getElementById('navbar-admin').style.display = "block";
    }
    document.getElementById('navbar-logout').style.cursor = "pointer";
    // ...
  } else {
    // User is signed out
    // ...
  }
});

document.getElementById('navbar-logout').addEventListener("click", function() {
  signOut(auth).then(() => {
    window.location.replace("login.html")
  }).catch((error) => {
    // An error happened.
  });
})

var curIndex = 0
var beforeUrls = []
var afterUrls = []
var emails = []
var times = []

const getData = async () => {
  //   const q = query(collection(db, "data"), limit(10));
  const q = query(collection(db, "data"), where("isApproved", "==", true));
  console.log(q);
  document.getElementById('spinner-loading').style.display = "block";
  document.getElementById('image-main').style.display = "none";
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    // let imageBefore = new Image(200, 200);
    // imageBefore.src = doc.data().urlBefore;
    // let imageAfter = new Image(200, 200);
    // imageAfter.src = doc.data().urlAfter;
    // const post = document.createElement("div");
    // post.appendChild(imageBefore);
    // post.appendChild(imageAfter);
    // document.getElementById("container").appendChild(post);
    beforeUrls.push(doc.data().urlBefore)
    afterUrls.push(doc.data().urlAfter)
    emails.push(doc.data().email)
    times.push(doc.data().time)
    
  });
  document.getElementById('before-image').style.backgroundImage="url(" + beforeUrls[curIndex] + ")"; // specify the image path here
  document.getElementById('after-image').style.backgroundImage="url(" + afterUrls[curIndex] + ")"; // specify the image path here
  document.getElementById('email').innerHTML = "Email: " + emails[curIndex];
  document.getElementById('upload_date').innerHTML = "Upload Date: " + times[curIndex];

  document.getElementById('spinner-loading').style.display = "none";
  document.getElementById('image-main').style.display = "block";
};
getData();

document.querySelector("#next").addEventListener("click", function () {
  curIndex = curIndex + 1;
  if(curIndex == beforeUrls.length)
  {
    curIndex = 0;
  }
  document.getElementById('before-image').style.backgroundImage="url(" + beforeUrls[curIndex] + ")"; // specify the image path here
  document.getElementById('after-image').style.backgroundImage="url(" + afterUrls[curIndex] + ")"; // specify the image path here
  document.getElementById('email').innerHTML = "Email: " + emails[curIndex];
  document.getElementById('upload_date').innerHTML = "Upload Date: " + times[curIndex];
})

document.querySelector("#previous").addEventListener("click", function () {
  curIndex = curIndex - 1;
  if(curIndex == -1)
  {
    curIndex = beforeUrls.length - 1;
  }
  document.getElementById('before-image').style.backgroundImage="url(" + beforeUrls[curIndex] + ")"; // specify the image path here
  document.getElementById('after-image').style.backgroundImage="url(" + afterUrls[curIndex] + ")"; // specify the image path here
  document.getElementById('email').innerHTML = "Email: " + emails[curIndex];
  document.getElementById('upload_date').innerHTML = "Upload Date: " + times[curIndex];
})
// });

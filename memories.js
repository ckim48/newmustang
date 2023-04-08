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

const getData = async () => {
  //   const q = query(collection(db, "data"), limit(10));
  const q = query(collection(db, "data"), where("isApproved", "==", true));
  console.log(q);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    let imageBefore = new Image(200, 200);
    imageBefore.src = doc.data().urlBefore;
    let imageAfter = new Image(200, 200);
    imageAfter.src = doc.data().urlAfter;
    const post = document.createElement("div");
    post.appendChild(imageBefore);
    post.appendChild(imageAfter);
    document.getElementById("container").appendChild(post);
  });
};
getData();
// });

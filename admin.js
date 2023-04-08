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
  increment,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
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
const auth = getAuth();
const ITEM_CLASSNAME = "listItems";

const init = async function uploadBeforePromise() {
  return new Promise(function (resolve, reject) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        resolve(user.uid);
        // console.log("idL ", uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  });
};

const getData = async () => {
  //   const q = query(collection(db, "data"), limit(10));
  const q = query(collection(db, "data"), where("isApproved", "==", false));
  //   const q = query(collection(db, "data"));
  console.log(q);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    let imageBefore = new Image(200, 200);
    imageBefore.src = doc.data().urlBefore;
    let imageAfter = new Image(200, 200);
    imageAfter.src = doc.data().urlAfter;

    // let email = document.createTextNode(doc.data().email);
    let block = document.createElement("div");
    block.id = doc.id;
    block.email = doc.data().email;
    let before = document.createElement("img");
    let after = document.createElement("img");
    let email = document.createElement("div");
    let approve = document.createElement("button");
    let decline = document.createElement("button");

    before.src = doc.data().urlBefore;
    after.src = doc.data().urlAfter;
    before.style.width = "200px";
    before.style.height = "200px";
    after.style.width = "200px";
    after.style.height = "200px";

    email.innerText = doc.data().email;

    approve.innerText = "Approve";
    approve.addEventListener("click", approval);
    decline.innerText = "Decline";
    decline.addEventListener("click", declinement);

    block.appendChild(before);
    block.appendChild(after);
    block.appendChild(email);
    block.appendChild(approve);
    block.appendChild(decline);

    block.classList.add(ITEM_CLASSNAME);
    document.getElementById("list").appendChild(block);
  });
};

// });

async function approval(event) {
  const li = event.target.parentElement;
  const docRef = doc(db, "data", li.id);
  await updateDoc(docRef, {
    isApproved: true,
  });
  const userRef = doc(db, "users", li.email);
  await updateDoc(userRef, {
    points: increment(5),
  });
  li.remove();
  alert("Approved!");
}

// deletes from the website and the firebase
async function declinement(event) {
  const li = event.target.parentElement;
  await deleteDoc(doc(db, "data", li.id));
  li.remove();
  alert("Declined!");
}

const uid = await init();
console.log("id: ", uid);
if (uid === "yAeFleZpWlWBR7BdCYPetKQkz0S2") {
  console.log("Logged in as admin");
  getData();
} else {
  alert("Please Log In as Admin!");
}

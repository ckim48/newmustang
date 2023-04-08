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
  getDocs,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  updateDoc,
  addDoc,
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
const RANK = "rank";

// 버튼이 클릭이 되면 function이 실행이 되도록 합니다.
document.querySelector("#send").addEventListener("click", async function () {
  // 파일 업로드 관련
  const before = document.querySelector("#before").files[0];
  const after = document.querySelector("#after").files[0];
  const email = document.querySelector("#email").value;
  const amount = document.querySelector("#amount").value;
  const type = document.querySelector("#type").value;
  const location = document.querySelector("#location").value;
  const time = document.querySelector("#time").value;

  let data = {
    email: email,
    amount: amount,
    type: type,
    location: location,
    time: time,
    urlBefore: "",
    urlAfter: "",
    isApproved: false,
  };

  async function uploadBeforePromise() {
    return new Promise(function (resolve, reject) {
      const storageRefBefore = ref(storage, "images/" + before.name);
      const uploadTaskBefore = uploadBytesResumable(storageRefBefore, before);

      uploadTaskBefore.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
        },
        (err) => {
          console.log("error", err);
          reject();
        },
        () => {
          getDownloadURL(uploadTaskBefore.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }
  async function uploadAfterPromise() {
    return new Promise(function (resolve, reject) {
      const storageRefAfter = ref(storage, "images/" + after.name);
      const uploadTaskAfter = uploadBytesResumable(storageRefAfter, after);
      uploadTaskAfter.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
        },
        function error(err) {
          console.log("error", err);
          reject();
        },
        () => {
          getDownloadURL(uploadTaskAfter.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }
  //   await uploadTaskBefore.on(
  //     "state_changed",
  //     (snapshot) => {
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       // console.log('Upload is ' + progress + '% done');
  //       switch (snapshot.state) {
  //         case "paused":
  //           console.log("Upload is paused");
  //           break;
  //         case "running":
  //           console.log("Upload is running");
  //           break;
  //       }
  //     },
  //     (error) => {
  //       // A full list of error codes is available at
  //       // https://firebase.google.com/docs/storage/web/handle-errors
  //       switch (error.code) {
  //         case "storage/unauthorized":
  //           // User doesn't have permission to access the object
  //           break;
  //         case "storage/canceled":
  //           // User canceled the upload
  //           break;

  //         // ...

  //         case "storage/unknown":
  //           // Unknown error occurred, inspect error.serverResponse
  //           break;
  //       }
  //     },
  //     () => {
  //       // Upload completed successfully, now we can get the download URL
  //       getDownloadURL(uploadTaskBefore.snapshot.ref).then((downloadURL) => {
  //         console.log("Image before available at", downloadURL);
  //         data.urlBefore = downloadURL;
  //       });
  //       // .then(() => upload());
  //     }
  //   );
  //   await uploadTaskAfter.on(
  //     "state_changed",
  //     (snapshot) => {
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       // console.log('Upload is ' + progress + '% done');
  //       switch (snapshot.state) {
  //         case "paused":
  //           console.log("Upload is paused");
  //           break;
  //         case "running":
  //           console.log("Upload is running");
  //           break;
  //       }
  //     },
  //     (error) => {
  //       // A full list of error codes is available at
  //       // https://firebase.google.com/docs/storage/web/handle-errors
  //       switch (error.code) {
  //         case "storage/unauthorized":
  //           // User doesn't have permission to access the object
  //           break;
  //         case "storage/canceled":
  //           // User canceled the upload
  //           break;

  //         // ...

  //         case "storage/unknown":
  //           // Unknown error occurred, inspect error.serverResponse
  //           break;
  //       }
  //     },
  //     () => {
  //       // Upload completed successfully, now we can get the download URL
  //       getDownloadURL(uploadTaskAfter.snapshot.ref)
  //         .then((downloadURL) => {
  //           console.log("Image after available at", downloadURL);
  //           data.urlAfter = downloadURL;
  //         })
  //         .then(() => upload());
  //     }
  //   );
  const storageUrlBefore = await uploadBeforePromise();
  const storageUrlAfter = await uploadAfterPromise();
  data.urlBefore = storageUrlBefore;
  data.urlAfter = storageUrlAfter;
  const upload = async () => {
    await addDoc(collection(db, "data"), data);
    alert("Uploaded Succesfully!");
  };
  upload();
});
let count = 1;
const getData = async () => {
  //   const q = query(collection(db, "data"), limit(10));
  const q = query(
    collection(db, "users"),
    orderBy("points", "desc"),
    limit(10)
  );
  console.log(q);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());

    let rank = document.createElement("tr");
    rank.classList.add('rank');
    let point = document.createElement("td");
    point.classList.add('point');
    let email = document.createElement("td");
    email.classList.add('email');
    let ranki = document.createElement("td");

    point.innerText = doc.data().points;
    
    email.innerText = doc.id;
    ranki.innerText = count;
    count++;
    rank.appendChild(ranki);
    rank.appendChild(email);
    rank.appendChild(point);
    

    rank.classList.add(RANK);
    document.getElementById("ranking").appendChild(rank);
  });
};
getData();

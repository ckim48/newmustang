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
const RANK = "rank";
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    document.getElementById('navbar-login').style.display = "none";
    document.getElementById('navbar-logout').style.display = "block";
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

// 버튼이 클릭이 되면 function이 실행이 되도록 합니다.
document.querySelector("#send").addEventListener("click", async function () {
  // 파일 업로드 관련
  const before = document.querySelector("#file-upload").files[0];
  const after = document.querySelector("#file-upload2").files[0];
  const description = document.querySelector("#descript").value;
  const user = auth.currentUser;

  if(user !== null) {
    var email;
    user.providerData.forEach((profile) => {
      email = profile.email;
    });

    let data = {
      email: email,
      description: description,
      urlBefore: "",
      urlAfter: "",
      isApproved: false,
      time: new Date().toLocaleDateString()
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
    document.getElementById("upload-spinner").style.display = "inline-block";
    document.getElementById("upload-text").style.display = "none";
    const storageUrlBefore = await uploadBeforePromise();
    const storageUrlAfter = await uploadAfterPromise();
    data.urlBefore = storageUrlBefore;
    data.urlAfter = storageUrlAfter;
    const upload = async () => {
      await addDoc(collection(db, "data"), data);
      alert("Uploaded Succesfully!");
      document.getElementById("upload-spinner").style.display = "none";
      document.getElementById("upload-text").style.display = "block";
      window.location.reload();
    };
    upload();
  }
  else {
    alert("Please login first.");
    window.location.href = "login.html"
  }
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
    rank.classList.add('list__row');
    let point = document.createElement("td");
    point.classList.add('list__cell');
    let email = document.createElement("td");
    email.classList.add('list__cell');
    let ranki = document.createElement("td");
    ranki.classList.add('list__cell');
    let name = document.createElement("td");
    name.classList.add('list__cell');
    
    ranki.innerHTML = "<span class='list__value'>" + count + "</span>"
    name.innerHTML = "<span class='list__value'>" + doc.data().firstName + " " + doc.data().lastName + "</span><small class='list__label'>Name</small>"
    point.innerHTML = "<span class='list__value'>" + doc.data().points + "</span><small class='list__label'>Points</small>"
    count++;
    rank.appendChild(ranki);
    rank.appendChild(name);
    rank.appendChild(point);
    

    rank.classList.add(RANK);
    document.getElementById("ranking").appendChild(rank);
  });
};
getData();

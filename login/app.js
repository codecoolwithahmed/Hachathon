import { auth, signInWithEmailAndPassword } from "../firebase/firebase.js";

let email = document.getElementById("email");
let password = document.getElementById("password");
let signin = document.getElementById("signin");

signin.addEventListener("click", (e) => {
    e.preventDefault()
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      // console.log(uid);
      new Noty({
        text: "Account Succefully Logged In!",
        type: "success",
        layout: "topRight",
        timeout: 3000,
      }).show();
      setTimeout(() => {
        window.location.href = "../admin/adminpanel/index.html"; 
      }, 4000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      new Noty({
        text: error.message,
        type: "error",
        layout: "topRight",
        timeout: 3000,
      }).show();
    });
});


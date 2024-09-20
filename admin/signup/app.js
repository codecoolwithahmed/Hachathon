import {
    auth,
    createUserWithEmailAndPassword,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    setDoc,
    db,
    doc
} from "../../firebase/firebase.js";

let name = document.getElementById('name');
let email = document.getElementById('email');
let password = document.getElementById('password');
let profilephoto = document.getElementById('profilephoto');

let signup = document.getElementById('signup');

signup.addEventListener('click', (e) => {
    e.preventDefault();

    const userData = {
        name: name.value,
        email: email.value,
        password: password.value,
        usertype: 'Admin',
        profilephoto: profilephoto.files[0]
    };

    signup.disabled = true;
    signup.innerText = "Loading...";

    createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            userData.uid = uid;

            // console.log(userData);

            const spaceRef = ref(storage, `userPhoto/${userData.profilephoto.name}`);
            return uploadBytes(spaceRef, userData.profilephoto)
                .then((snapshot) => {
                    console.log('Uploaded a profile photo!');
                    return getDownloadURL(spaceRef);
                });
        })
        .then((url) => {
            // console.log('Profile photo URL:', url);
            userData.profilephoto = url;

            const userdbRef = doc(db, 'admins', userData.uid);
            setDoc(userdbRef, userData)
                .then(() => {
                    console.log('userdata uploaded to db');
                    new Noty({
                        text: "Account Successfully Created!",
                        type: "success",
                        layout: "topRight",
                        timeout: 3000,
                    }).show();

                    signup.disabled = false;
                    signup.innerText = "Signup";
                })

            signup.disabled = false;
            signup.innerText = "Signup";

            setTimeout(() => {
                window.location.href = "../adminpanel/index.html";
            }, 5000);
        })
        .catch((error) => {
            // console.log('Error:', error);
            new Noty({
                text: `Error: ${error.message}`,
                type: "error",
                layout: "topRight",
                timeout: 3000,
            }).show();

            signup.disabled = false;
            signup.innerText = "Signup";
        });
});

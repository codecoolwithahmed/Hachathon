import {
    auth,
    db,
    doc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    onAuthStateChanged,
    signOut,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    query,
    where,
    updateDoc,
} from "../../firebase/firebase.js";

let adminphoto = document.getElementById("adminphoto");
let adminName = document.getElementById("adminname");
let adminemail = document.getElementById("adminemail");
let addstudentbtn = document.getElementById("add-student-btn");

let formContainer = document.getElementById("formContainer");
let saveStudentBtn = document.getElementById("saveButton");
let profilePhoto = document.getElementById("profilePhoto");
let studentName = document.getElementById("studentName");
let studentEmail = document.getElementById("studentEmail");
let studentCNIC = document.getElementById("studentCNIC");
let studentPassword = document.getElementById("studentPassword");

let card = document.getElementById("card");

let detailedPhoto = document.getElementById("detailedPhoto");
let detailedName = document.getElementById("detailedName");
let detailedEmail = document.getElementById("detailedEmail");
let detailedCNIC = document.getElementById("detailedCNIC");
let detailedPassword = document.getElementById("detailedPassword");
let editstudentdata = document.getElementById("editstudentdata");
let savestudentdata = document.getElementById("savestudentdata");
let editstudentinputname = document.getElementById("editstudentinputname");
let editstudentinputemail = document.getElementById("editstudentinputemail");
let editstudentinputcnic = document.getElementById("editstudentinputcnic");
let editstudentinputpassword = document.getElementById("editstudentinputpassword");

let mathMarksSpan = document.getElementById("mathMarksSpan");
let mathMarksInput = document.getElementById("mathMarksInput");
let mathGradeSpan = document.getElementById("mathGradeSpan");
let mathGradeInput = document.getElementById("mathGradeInput");
let mathTotalMarksSpan = document.getElementById("mathTotalMarksSpan");
let mathTotalMarksInput = document.getElementById("mathTotalMarksInput");

let englishMarksSpan = document.getElementById("englishMarksSpan");
let englishMarksInput = document.getElementById("englishMarksInput");
let englishGradeSpan = document.getElementById("englishGradeSpan");
let englishGradeInput = document.getElementById("englishGradeInput");
let englishTotalMarksSpan = document.getElementById("englishTotalMarksSpan");
let englishTotalMarksInput = document.getElementById("englishTotalMarksInput");

let urduMarksSpan = document.getElementById("urduMarksSpan");
let urduMarksInput = document.getElementById("urduMarksInput");
let urduGradeSpan = document.getElementById("urduGradeSpan");
let urduGradeInput = document.getElementById("urduGradeInput");
let urduTotalMarksSpan = document.getElementById("urduTotalMarksSpan");
let urduTotalMarksInput = document.getElementById("urduTotalMarksInput");

let islamiatMarksSpan = document.getElementById("islamiatMarksSpan");
let islamiatGradeSpan = document.getElementById("islamiatGradeSpan");
let islamiatGradeInput = document.getElementById("islamiatGradeInput");
let islamiatTotalMarksSpan = document.getElementById("islamiatTotalMarksSpan");
let islamiatTotalMarksInput = document.getElementById("islamiatTotalMarksInput");
let islamiatMarksInput = document.getElementById("islamiatMarksInput");

let closeDetailedViewButton = document.getElementById("closeDetailedViewButton");
let detailedViewContainer = document.getElementById("detailedViewContainer");

let editMarksButton = document.getElementById("editMarksButton");
let saveMarksButton = document.getElementById("saveMarksButton");

let span = document.querySelectorAll(".span");
let input = document.querySelectorAll(".input");

let logoutbtn = document.getElementById("log-out-btn");

addstudentbtn.addEventListener("click", () => {
    formContainer.style.display = "flex";
});

function generateUID() {
    return "student-" + Date.now();

}

saveStudentBtn.addEventListener("click", async () => {

    saveStudentBtn.disabled = true
    saveStudentBtn.innerText = "Loading...";

    const newStudent = {
        photo: profilePhoto.files[0],
        name: studentName.value,
        email: studentEmail.value,
        cnic: studentCNIC.value,
        password: studentPassword.value,
        usertype: "student",
        uid: "",
        adminuid: auth.currentUser.uid,
        id: generateUID(),
        subjects: {
            Math: { marks: "", grade: "", totalMarks: "" },
            English: { marks: "", grade: "", totalMarks: "" },
            Urdu: { marks: "", grade: "", totalMarks: "" },
            Islamiat: { marks: "", grade: "", totalMarks: "" },
        },
    };

    try {
        const spaceRef = ref(storage, `studentPhoto/${newStudent.photo.name}`);
        await uploadBytes(spaceRef, newStudent.photo);
        const photoURL = await getDownloadURL(spaceRef);
        newStudent.photo = photoURL;

        const userdbRef = collection(db, "student");
        const docRef = await addDoc(userdbRef, newStudent);
        await updateDoc(docRef, {
            uid: docRef.id
        })
        // console.log("Student data uploaded to DB with ID:", docRef.id);
        saveStudentBtn.disabled = false
        saveStudentBtn.innerText = "Save";
        new Noty({
            text: "Student data Added!",
            type: "success",
            layout: "topRight",
            timeout: 3000,
        }).show();
        setTimeout(() => {
            window.location.reload();
        }, 5000);

        formContainer.style.display = "none";

        gettingstudentdata();
    } catch (error) {
        console.log("Error:", error);
    }
});

async function gettingstudentdata(uid) {
    try {
        const q = query(collection(db, "student"), where("adminuid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const student = doc.data();
            const { cnic, email, name, password, photo, uid } = student;

            card.innerHTML += `
                <div id="${uid}" class="student-card">
                    <img src="${photo}" alt="Profile Photo" class="profile-photo">
                    <h3>${name}</h3>
                    <p class="label">Email:</p>
                    <p>${email}</p>
                    <p class="label">CNIC:</p>
                    <p>${cnic}</p>
                    <p class="label">Password:</p>
                    <p>${password}</p>
                </div>
            `;
        });

        document.querySelectorAll(".student-card").forEach((card) => {
            card.addEventListener("click", async (event) => {
                const uid = event.currentTarget.id;
                const studentRef = doc(db, "student", uid);
                await updateDoc(studentRef, { uid: uid })
                await showDetailedView(uid);

                console.log(uid);
            });
        });
    } catch (error) {
        console.log("Error fetching student data:", error);
    }
}

async function showDetailedView(uid) {
    try {
        const docRef = doc(db, "student", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const student = docSnap.data();
            const { cnic, email, name, password, photo, subjects } = student;
            console.log(subjects.English.totalMarks);

            detailedPhoto.src = photo;
            detailedName.textContent = name;
            detailedEmail.textContent = email;
            detailedCNIC.textContent = cnic;
            detailedPassword.textContent = password;

            mathMarksSpan.textContent = subjects.Math.marks;
            mathGradeSpan.textContent = subjects.Math.grade;
            mathTotalMarksSpan.textContent = subjects.Math.totalMarks;

            englishMarksSpan.textContent = subjects.English.marks;
            englishGradeSpan.textContent = subjects.English.grade;
            englishTotalMarksSpan.textContent = subjects.English.totalMarks;

            urduMarksSpan.textContent = subjects.Urdu.marks;
            urduGradeSpan.textContent = subjects.Urdu.grade;
            urduTotalMarksSpan.textContent = subjects.Urdu.totalMarks;

            islamiatMarksSpan.textContent = subjects.Islamiat.marks;
            islamiatGradeSpan.textContent = subjects.Islamiat.grade;
            islamiatTotalMarksSpan.textContent = subjects.Islamiat.totalMarks;

            if (editstudentdata) {
                editstudentdata.addEventListener('click', () => {

                    editstudentdata.style.display = 'none'
                    savestudentdata.style.display = 'inline-block'
                    editstudentinputname.style.display = 'inline-block'
                    editstudentinputemail.style.display = 'inline-block'
                    editstudentinputcnic.style.display = 'inline-block'
                    editstudentinputpassword.style.display = 'inline-block'
                    detailedName.style.display = 'none'
                    detailedEmail.style.display = 'none'
                    detailedCNIC.style.display = 'none'
                    detailedPassword.style.display = 'none'
                })
            }

            if (savestudentdata) {
                savestudentdata.addEventListener('click', async () => {

                    savestudentdata.style.display = 'none'
                    editstudentdata.style.display = 'inline-block'
                    editstudentinputname.style.display = 'none'
                    editstudentinputemail.style.display = 'none'
                    editstudentinputcnic.style.display = 'none'
                    editstudentinputpassword.style.display = 'none'
                    detailedName.style.display = 'inline-block'
                    detailedEmail.style.display = 'inline-block'
                    detailedCNIC.style.display = 'inline-block'
                    detailedPassword.style.display = 'inline-block'

                    try {
                        const studentRef = doc(db, "student", uid);

                        await updateDoc(studentRef, {
                            name: editstudentinputname.value,
                            email: editstudentinputemail.value,
                            cnic: editstudentinputcnic.value,
                            password: editstudentinputpassword.value,
                        })
                        detailedName.textContent = editstudentinputname.value;
                        detailedEmail.textContent = editstudentinputemail.value;
                        detailedCNIC.textContent = editstudentinputcnic.value;
                        detailedPassword.textContent = editstudentinputpassword.value;

                        new Noty({
                            text: "Student data Updated!",
                            type: "success",
                            layout: "topRight",
                            timeout: 3000,
                        }).show();


                    } catch (error) {
                        console.log('error in updating profile', error);

                    }

                })
            }

            if (editMarksButton) {
                editMarksButton.addEventListener("click", () => {
                    span.forEach((span) => {
                        span.style.display = "none";
                    });

                    input.forEach((input) => {
                        input.style.display = "block";
                    });

                    editMarksButton.style.display = 'none';
                    saveMarksButton.style.display = 'inline-block';
                });
            }

            if (saveMarksButton) {
                saveMarksButton.addEventListener("click", async () => {
                    try {
                        const studentRef = doc(db, "student", uid);

                        await updateDoc(studentRef, {
                            subjects: {
                                Math: {
                                    marks: mathMarksInput.value,
                                    grade: mathGradeInput.value,
                                    totalMarks: mathTotalMarksInput.value,
                                },
                                English: {
                                    marks: englishMarksInput.value,
                                    grade: englishGradeInput.value,
                                    totalMarks: englishTotalMarksInput.value,
                                },
                                Urdu: {
                                    marks: urduMarksInput.value,
                                    grade: urduGradeInput.value,
                                    totalMarks: urduTotalMarksInput.value,
                                },
                                Islamiat: {
                                    marks: islamiatMarksInput.value,
                                    grade: islamiatGradeInput.value,
                                    totalMarks: islamiatTotalMarksInput.value,
                                },
                            },
                        });

                        console.log("Marks updated successfully in Firestore");

                        mathMarksSpan.textContent = mathMarksInput.value;
                        mathGradeSpan.textContent = mathGradeInput.value;
                        mathTotalMarksSpan.textContent = mathTotalMarksInput.value;

                        englishMarksSpan.textContent = englishMarksInput.value;
                        englishGradeSpan.textContent = englishGradeInput.value;
                        englishTotalMarksSpan.textContent = englishTotalMarksInput.value;

                        urduMarksSpan.textContent = urduMarksInput.value;
                        urduGradeSpan.textContent = urduGradeInput.value;
                        urduTotalMarksSpan.textContent = urduTotalMarksInput.value;

                        islamiatMarksSpan.textContent = islamiatMarksInput.value;
                        islamiatGradeSpan.textContent = islamiatGradeInput.value;
                        islamiatTotalMarksSpan.textContent = islamiatTotalMarksInput.value;

                        span.forEach((span) => {
                            span.style.display = "block";
                        });

                        input.forEach((input) => {
                            input.style.display = "none";
                        });
                        editMarksButton.style.display = 'inline-block';
                        saveMarksButton.style.display = 'none';

                        new Noty({
                            text: "Marks Added!",
                            type: "success",
                            layout: "topRight",
                            timeout: 3000,
                        }).show();
                    } catch (error) {
                        console.error("Error updating document: ", error);
                    }
                });
            }

            detailedViewContainer.style.display = "flex";
            closeDetailedViewButton.addEventListener('click', () => {
                detailedViewContainer.style.display = 'none';
            });
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log("Error fetching student details:", error);
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const admindocRef = doc(db, "admins", uid);

        gettingstudentdata(uid)

        try {
            const admindocSnap = await getDoc(admindocRef);
            if (admindocSnap.exists()) {
                adminphoto.src = admindocSnap.data().profilephoto;
                adminName.innerText = admindocSnap.data().name;
                adminemail.innerText = admindocSnap.data().email;
            } else {
                console.log("No such document!", user.email);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    } else {
        console.log("Admin logged off");
        window.location.href = "login.html";
    }
});

logoutbtn.addEventListener('click', () => {

    signOut(auth).then(() => {
        window.location.href = "../../index.html"
    }).catch((error) => {
    });
})

gettingstudentdata();
window.onload = function () {
};

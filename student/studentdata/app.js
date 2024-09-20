import {
    db,
    doc,
    getDoc,
    getDocs,
    collection,
    query,
    where,
    updateDoc,
} from "../../firebase/firebase.js";

let studentimg = document.getElementById('studentimg');
let studentname = document.getElementById('studentname');
let studentemail = document.getElementById('studentemail');
let studentPassword = document.getElementById('studentPassword');
let studentCNIC = document.getElementById('studentCNIC');

let englishMarks = document.getElementById('englishMarks');
let englishGrade = document.getElementById('englishGrade');
let englishTotalMarks = document.getElementById('englishTotalMarks');
let mathsMarks = document.getElementById('mathsMarks');
let mathsGrade = document.getElementById('mathsGrade');
let mathsTotalMarks = document.getElementById('mathsTotalMarks');
let urduMarks = document.getElementById('urduMarks');
let urduGrade = document.getElementById('urduGrade');
let urduTotalMarks = document.getElementById('urduTotalMarks');
let islamiatMarks = document.getElementById('islamiatMarks');
let islamiatGrade = document.getElementById('islamiatGrade');
let islamiatTotalMarks = document.getElementById('islamiatTotalMarks');

let nameinput = document.getElementById('nameinput');
let emailinput = document.getElementById('emailinput');
let passwordinput = document.getElementById('passwordinput');
let cnicinput = document.getElementById('cnicinput');
let editbtn = document.getElementById('editbtn');
let savebtn = document.getElementById('savebtn');

let logincontainer = document.getElementById('login-container');
let studentpanelcard = document.getElementById('student-panel-card');
let closeDetailedViewButton = document.getElementById('closeDetailedViewButton');
let errorMessage = document.getElementById('error-message'); 

let resultinput = document.getElementById('resultinput');
let result = document.getElementById('result');

let currentUid ; 

result.addEventListener('click', async (e) => {
    e.preventDefault(); 

    const cnic = resultinput.value.trim(); 

    if (cnic) {
        const exists = await checkStudentExists(cnic);
        if (exists) {
            await getStudentDataByCNIC(cnic);
            studentpanelcard.style.display = 'block';
            logincontainer.style.display = 'none';
            errorMessage.style.display = 'none';
        } else {
            errorMessage.innerText = "No student found with the provided CNIC.";
            errorMessage.style.display = 'block'; 
            studentpanelcard.style.display = 'none';
            logincontainer.style.display = 'block';
        }
    } else {
        console.log("CNIC field is empty.");
    }
});

closeDetailedViewButton.addEventListener('click', () => {
    studentpanelcard.style.display = 'none';
    logincontainer.style.display = 'block';
});

async function getStudentDataByCNIC(cnic) {
    try {
        const q = query(collection(db, "student"), where("cnic", "==", cnic));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const student = doc.data();
                currentUid = doc.id; 

                studentimg.src = student.photo;
                studentname.innerText = student.name;
                studentemail.innerText = student.email;
                studentPassword.innerText = student.password;
                studentCNIC.innerText = student.cnic;
                englishMarks.innerText = student.subjects.English.marks;
                englishGrade.innerText = student.subjects.English.grade;
                englishTotalMarks.innerText = student.subjects.English.totalMarks;
                mathsMarks.innerText = student.subjects.Math.marks;
                mathsGrade.innerText = student.subjects.Math.grade;
                mathsTotalMarks.innerText = student.subjects.Math.totalMarks;
                urduMarks.innerText = student.subjects.Urdu.marks;
                urduGrade.innerText = student.subjects.Urdu.grade;
                urduTotalMarks.innerText = student.subjects.Urdu.totalMarks;
                islamiatMarks.innerText = student.subjects.Islamiat.marks;
                islamiatGrade.innerText = student.subjects.Islamiat.grade;
                islamiatTotalMarks.innerText = student.subjects.Islamiat.totalMarks;
            });
        } else {
            console.log("No student found with the provided CNIC.");
        }
    } catch (error) {
        console.error("Error fetching student data:", error);
    }
}

async function checkStudentExists(cnic) {
    try {
        const q = query(collection(db, "student"), where("cnic", "==", cnic));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking student existence:", error);
        return false;
    }
}

editbtn.addEventListener('click', () => {
    nameinput.style.display = 'block';
    emailinput.style.display = 'block';
    passwordinput.style.display = 'block';
    cnicinput.style.display = 'block';

    studentname.style.display = 'none';
    studentemail.style.display = 'none';
    studentPassword.style.display = 'none';
    studentCNIC.style.display = 'none';

    savebtn.style.display = 'block'
    editbtn.style.display = 'none'
});

savebtn.addEventListener('click', async () => {
    
    nameinput.style.display = 'none';
    emailinput.style.display = 'none';
    passwordinput.style.display = 'none';
    cnicinput.style.display = 'none';

    studentname.style.display = 'block';
    studentemail.style.display = 'block';
    studentPassword.style.display = 'block';
    studentCNIC.style.display = 'block';

    savebtn.style.display = 'none'
    editbtn.style.display = 'block'

    const docRef = doc(db, "student", currentUid); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        try {
            await updateDoc(docRef, {
                name: nameinput.value,
                email: emailinput.value,
                cnic: cnicinput.value,
                password: passwordinput.value,
            });

            studentname.textContent = nameinput.value;
            studentemail.textContent = emailinput.value;
            studentCNIC.textContent = cnicinput.value;
            studentPassword.textContent = passwordinput.value; 

            new Noty({
                text: "Account Information Successfully Updated!",
                type: "success",
                layout: "topRight",
                timeout: 3000,
            }).show();

        } catch (error) {
            console.error('Error updating profile:', error); 
        }
    } else {
        console.log("No such document!"); 
    }
});

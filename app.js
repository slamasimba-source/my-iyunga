/* =====================================
   IYUNGA STUDENT MANAGEMENT SYSTEM
   JAVASCRIPT
===================================== */

// 1. SAMPLE STUDENT DATA

const sampleStudents = [

    {
        id: "IY001",
        name: "Amina John",
        dob: "2009-04-12",
        gender: "Female",
        parent: "John Peter",
        phone: "0712345678",
        address: "Iyunga Mbeya",
        studentClass: "Form One"
    },

    {
        id: "IY002",
        name: "Baraka Michael",
        dob: "2008-08-20",
        gender: "Male",
        parent: "Michael Joseph",
        phone: "0755123456",
        address: "Mbeya",
        studentClass: "Form Two"
    },

    {
        id: "IY003",
        name: "Neema David",
        dob: "2007-02-15",
        gender: "Female",
        parent: "David Samuel",
        phone: "0766123456",
        address: "Iyunga",
        studentClass: "Form Three"
    }

];


// 2. GET STUDENTS FROM STORAGE

function getStudents() {

    const savedData = localStorage.getItem("iyungaStudents");

    if (savedData === null) {

        localStorage.setItem(
            "iyungaStudents",
            JSON.stringify(sampleStudents)
        );

        return [...sampleStudents];

    }

    try {

        return JSON.parse(savedData);

    } catch (error) {

        console.error("Error reading student records:", error);

        return [];

    }

}


// 3. SAVE STUDENT DATA

function saveStudents(students) {

    localStorage.setItem(
        "iyungaStudents",
        JSON.stringify(students)
    );

}


// 4. LOGIN FUNCTION

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");


        if (username === "admin" && password === "12345") {

            sessionStorage.setItem(
                "iyungaLoggedIn",
                "true"
            );

            window.location.href = "dashboard.html";

        } else {

            message.textContent =
                "Incorrect username or password!";

            message.style.color = "red";

        }

    });

}


// 5. PROTECT MANAGEMENT PAGES

const protectedPages = [
    "dashboard.html",
    "data-entry.html",
    "reports.html"
];

const currentPage =
    window.location.pathname.split("/").pop();

if (
    protectedPages.includes(currentPage) &&
    sessionStorage.getItem("iyungaLoggedIn") !== "true"
) {

    window.location.replace("login.html");

}


// 6. LOGOUT FUNCTION

function logout() {

    sessionStorage.removeItem("iyungaLoggedIn");

    window.location.href = "login.html";

}


// 7. SAFE HTML DISPLAY

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

    })[char]);

}


// 8. DASHBOARD STATISTICS

function loadDashboard() {

    const totalElement =
        document.getElementById("totalStudents");

    if (!totalElement) return;

    const students = getStudents();


    totalElement.textContent = students.length;


    document.getElementById("maleStudents").textContent =
        students.filter(student =>
            student.gender === "Male"
        ).length;


    document.getElementById("femaleStudents").textContent =
        students.filter(student =>
            student.gender === "Female"
        ).length;


    const classes = new Set(
        students.map(student => student.studentClass)
    );

    document.getElementById("totalClasses").textContent =
        classes.size;


    // RECENT STUDENTS

    const recentStudents =
        document.getElementById("recentStudents");

    const recent = [...students].slice(-5).reverse();


    if (recent.length === 0) {

        recentStudents.innerHTML =
            '<tr><td colspan="4">No students registered yet.</td></tr>';

    } else {

        recentStudents.innerHTML = recent.map(student => `

            <tr>

                <td>${escapeHTML(student.name)}</td>

                <td>${escapeHTML(student.gender)}</td>

                <td>${escapeHTML(student.studentClass)}</td>

                <td>${escapeHTML(student.parent)}</td>

            </tr>

        `).join("");

    }

}

loadDashboard();


// 9. STUDENT REGISTRATION

const studentForm =
    document.getElementById("studentForm");


if (studentForm) {

    const dobInput = document.getElementById("dob");

    dobInput.max = new Date().toISOString().split("T")[0];


    studentForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const student = {

            id: "IY" + Date.now(),

            name: document.getElementById("studentName").value.trim(),

            dob: dobInput.value,

            gender: document.getElementById("gender").value,

            parent: document.getElementById("parentName").value.trim(),

            phone: document.getElementById("parentPhone").value.trim(),

            address: document.getElementById("address").value.trim(),

            studentClass: document.getElementById("studentClass").value

        };


        const message =
            document.getElementById("formMessage");


        if (Object.values(student).some(value => !String(value).trim())) {

            message.textContent =
                "Please fill in all required fields.";

            message.style.color = "red";

            return;

        }


        const students = getStudents();

        students.push(student);

        saveStudents(students);


        message.textContent =
            "Student registered successfully!";

        message.style.color = "green";


        studentForm.reset();

    });

}


// 10. DISPLAY STUDENT REPORTS

function displayStudents() {

    const table =
        document.getElementById("studentTable");

    if (!table) return;


    const students = getStudents();


    const searchValue =
        document.getElementById("searchStudent").value.toLowerCase();

    const selectedClass =
        document.getElementById("classFilter").value;


    const filteredStudents = students.filter(student => {

        const searchText = [

            student.name,
            student.studentClass,
            student.parent,
            student.phone

        ].join(" ").toLowerCase();


        const matchesSearch =
            searchText.includes(searchValue);


        const matchesClass =
            selectedClass === "" ||
            student.studentClass === selectedClass;


        return matchesSearch && matchesClass;

    });


    if (filteredStudents.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">No student records found.</td>
            </tr>
        `;

    } else {

        table.innerHTML = filteredStudents.map(student => `

            <tr>

                <td>${escapeHTML(student.id)}</td>

                <td>${escapeHTML(student.name)}</td>

                <td>${escapeHTML(student.gender)}</td>

                <td>${escapeHTML(student.studentClass)}</td>

                <td>${escapeHTML(student.parent)}</td>

                <td>${escapeHTML(student.phone)}</td>

                <td>
                    <button
                        class="delete-btn"
                        data-delete="${escapeHTML(student.id)}">
                        Delete
                    </button>
                </td>

            </tr>

        `).join("");

    }


    document.getElementById("reportCount").textContent =

        "Showing " + filteredStudents.length +
        " of " + students.length + " students.";

}


// 11. SEARCH AND FILTER STUDENTS

const searchInput =
    document.getElementById("searchStudent");

const classFilter =
    document.getElementById("classFilter");


if (searchInput && classFilter) {

    searchInput.addEventListener(
        "input",
        displayStudents
    );

    classFilter.addEventListener(
        "change",
        displayStudents
    );


    // DELETE STUDENT

    document.getElementById("studentTable")
        .addEventListener("click", function(event) {

            const button =
                event.target.closest("[data-delete]");

            if (!button) return;


            const id = button.dataset.delete;


            if (!confirm("Are you sure you want to delete this student?")) {

                return;

            }


            const students = getStudents();

            const updatedStudents = students.filter(
                student => student.id !== id
            );


            saveStudents(updatedStudents);

            displayStudents();

        });


    displayStudents();

}


// 12. DOWNLOAD STUDENT REPORT

const downloadButton =
    document.getElementById("downloadCsv");


if (downloadButton) {

    downloadButton.addEventListener("click", function() {

        const students = getStudents();


        const headers = [

            "Student ID",
            "Student Name",
            "Date of Birth",
            "Gender",
            "Parent Name",
            "Phone",
            "Address",
            "Class"

        ];


        const rows = students.map(student => [

            student.id,
            student.name,
            student.dob,
            student.gender,
            student.parent,
            student.phone,
            student.address,
            student.studentClass

        ]);


        const csv = [headers, ...rows].map(row =>

            row.map(value =>

                '"' + String(value ?? "").replace(/"/g, '""') + '"'

            ).join(",")

        ).join("\r\n");


        const blob = new Blob(

            ["\uFEFF" + csv],

            { type: "text/csv;charset=utf-8;" }

        );


        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "Iyunga_Student_Report.csv";

        link.click();

        URL.revokeObjectURL(url);

    });

}
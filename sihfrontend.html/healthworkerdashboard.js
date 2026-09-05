
let patients = [];
let appointments = [];
let referrals = [];
let diagnostics = [];
let medicines = [];
let followups = [];



window.onload = function () {

    document.getElementById("loadingScreen").style.display = "none";

    displayCurrentDate();

    checkConnection();

};



function displayCurrentDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("currentDate").innerText =
        date.toLocaleDateString("en-IN", options);

}


function toggleSidebar() {

    document.getElementById("sidebar").classList.toggle("show");

}



function showSection(sectionId, element) {

    document.querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove("active-section");
        });

    document.getElementById(sectionId)
        .classList.add("active-section");


    document.querySelectorAll(".menu li")
        .forEach(item => {
            item.classList.remove("active");
        });

    element.classList.add("active");


    updatePageTitle(sectionId);


    if (window.innerWidth < 850) {
        document.getElementById("sidebar")
            .classList.remove("show");
    }

}


function showSectionDirect(sectionId) {

    document.querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove("active-section");
        });

    document.getElementById(sectionId)
        .classList.add("active-section");


    document.querySelectorAll(".menu li")
        .forEach(item => {

            item.classList.remove("active");

            if (
                item.getAttribute("onclick") &&
                item.getAttribute("onclick").includes(sectionId)
            ) {
                item.classList.add("active");
            }

        });


    updatePageTitle(sectionId);

}


function updatePageTitle(sectionId) {

    const titles = {

        dashboard: "Health Worker Dashboard",
        patients: "Patient Management",
        triage: "Digital Triage",
        appointments: "Appointments & Queue",
        teleconsultation: "Teleconsultation",
        referrals: "Referral Tracking",
        diagnostics: "Diagnostic Coordination",
        medicine: "Medicine Availability",
        followup: "High-Risk Follow-up",
        emergency: "Emergency Escalation"

    };

    document.getElementById("pageTitle").innerText =
        titles[sectionId];

}


function openPatientModal() {

    document.getElementById("patientModal").style.display = "flex";

}


function closePatientModal() {

    document.getElementById("patientModal").style.display = "none";

}



document.getElementById("patientForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const patient = {

            id: "PT-" + Date.now().toString().slice(-6),

            name: document.getElementById("patientName").value,

            age: document.getElementById("patientAge").value,

            gender: document.getElementById("patientGender").value,

            contact: document.getElementById("patientContact").value,

            address: document.getElementById("patientAddress").value,

            status: "Active"

        };


        patients.push(patient);

        renderPatients();

        updateDashboard();

        closePatientModal();

        this.reset();

        showToast("Patient registered successfully");

    });



function renderPatients() {

    const table = document.getElementById("patientTableBody");

    if (patients.length === 0) {

        table.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    No patient records available.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = "";


    patients.forEach(patient => {

        table.innerHTML += `

        <tr>

            <td>${patient.id}</td>

            <td>${patient.name}</td>

            <td>${patient.age}</td>

            <td>${patient.gender}</td>

            <td>${patient.contact}</td>

            <td>
                <span class="badge badge-success">
                    ${patient.status}
                </span>
            </td>

            <td>
                <button
                    class="primary-btn"
                    onclick="viewPatient('${patient.id}')">
                    View
                </button>
            </td>

        </tr>

        `;

    });

}


function viewPatient(id) {

    const patient =
        patients.find(p => p.id === id);

    if (patient) {

        alert(
            "Patient ID: " + patient.id +
            "\nName: " + patient.name +
            "\nAge: " + patient.age +
            "\nGender: " + patient.gender +
            "\nContact: " + patient.contact +
            "\nAddress: " + patient.address
        );

    }

}



function filterPatients() {

    const value =
        document.getElementById("patientSearch")
            .value.toLowerCase();


    const rows =
        document.querySelectorAll("#patientTableBody tr");


    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

    });

}



function searchPatient() {

    const value =
        document.getElementById("globalSearch")
            .value.toLowerCase();


    if (!value) return;


    const patient =
        patients.find(p =>
            p.name.toLowerCase().includes(value) ||
            p.id.toLowerCase().includes(value)
        );


    if (patient) {

        showSectionDirect("patients");

        document.getElementById("patientSearch").value =
            value;

        filterPatients();

    }

}




document.getElementById("triageForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const temperature =
            parseFloat(
                document.getElementById("temperature").value
            );

        const oxygen =
            parseFloat(
                document.getElementById("oxygenLevel").value
            );


        let priority = "Normal";
        let priorityClass = "badge-success";


        if (
            temperature >= 39 ||
            oxygen < 90
        ) {

            priority = "Emergency";
            priorityClass = "badge-danger";

        }

        else if (
            temperature >= 38 ||
            oxygen < 95
        ) {

            priority = "High Priority";
            priorityClass = "badge-warning";

        }


        document.getElementById("triageResult").innerHTML = `

            <div class="panel" style="margin-top:20px">

                <h3>Triage Assessment Result</h3>

                <br>

                <p>
                    Patient:
                    <strong>
                        ${document.getElementById("triagePatient").value}
                    </strong>
                </p>

                <br>

                <p>
                    Priority:
                    <span class="badge ${priorityClass}">
                        ${priority}
                    </span>
                </p>

            </div>

        `;


        showToast("Triage assessment recorded");

        this.reset();

    });



document.getElementById("appointmentForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const appointment = {

            patient:
                document.getElementById("appointmentPatient").value,

            date:
                document.getElementById("appointmentDate").value,

            type:
                document.getElementById("consultationType").value

        };


        appointments.push(appointment);

        renderAppointments();

        updateDashboard();

        this.reset();

        showToast("Appointment added to queue");

    });


function renderAppointments() {

    const list =
        document.getElementById("appointmentList");


    if (appointments.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-calendar"></i>
                <p>No appointments scheduled</p>
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    appointments.forEach((appointment, index) => {

        list.innerHTML += `

            <div class="list-item">

                <div>

                    <h4>
                        Queue #${index + 1} -
                        ${appointment.patient}
                    </h4>

                    <p>
                        ${appointment.type}
                        | ${appointment.date}
                    </p>

                </div>

                <span class="badge badge-warning">
                    Waiting
                </span>

            </div>

        `;

    });

}



function requestTeleconsultation() {

    const patient =
        document.getElementById("telePatient").value;

    const specialist =
        document.getElementById("specialist").value;


    if (!patient || !specialist) {

        showToast(
            "Please enter patient name and select specialist"
        );

        return;

    }


    showToast(
        "Teleconsultation request created successfully"
    );

}




document.getElementById("referralForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const referral = {

            patient:
                document.getElementById("referralPatient").value,

            facility:
                document.getElementById("referralFacility").value,

            reason:
                document.getElementById("referralReason").value,

            priority:
                document.getElementById("referralPriority").value

        };


        referrals.push(referral);

        renderReferrals();

        updateDashboard();

        this.reset();

        showToast("Referral created successfully");

    });


function renderReferrals() {

    const list =
        document.getElementById("referralList");


    if (referrals.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-share"></i>
                <p>No referrals created</p>
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    referrals.forEach(referral => {

        let badgeClass = "badge-success";

        if (referral.priority === "High") {
            badgeClass = "badge-warning";
        }

        if (referral.priority === "Emergency") {
            badgeClass = "badge-danger";
        }


        list.innerHTML += `

            <div class="list-item">

                <div>

                    <h4>
                        ${referral.patient}
                    </h4>

                    <p>
                        ${referral.facility}
                    </p>

                    <p>
                        ${referral.reason}
                    </p>

                </div>

                <span class="badge ${badgeClass}">
                    ${referral.priority}
                </span>

            </div>

        `;

    });

}




document.getElementById("diagnosticForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const diagnostic = {

            patient:
                document.getElementById("diagnosticPatient").value,

            test:
                document.getElementById("testType").value

        };


        diagnostics.push(diagnostic);

        renderDiagnostics();

        this.reset();

        showToast("Diagnostic test requested");

    });


function renderDiagnostics() {

    const list =
        document.getElementById("diagnosticList");


    if (diagnostics.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-flask"></i>
                <p>No diagnostic requests</p>
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    diagnostics.forEach(diagnostic => {

        list.innerHTML += `

            <div class="list-item">

                <div>

                    <h4>
                        ${diagnostic.patient}
                    </h4>

                    <p>
                        ${diagnostic.test}
                    </p>

                </div>

                <span class="badge badge-warning">
                    Pending
                </span>

            </div>

        `;

    });

}



document.getElementById("medicineForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const medicine = {

            name:
                document.getElementById("medicineName").value,

            quantity:
                document.getElementById("medicineQuantity").value,

            status:
                document.getElementById("medicineStatus").value

        };


        medicines.push(medicine);

        renderMedicines();

        this.reset();

        showToast("Medicine inventory updated");

    });


function renderMedicines() {

    const list =
        document.getElementById("medicineList");


    if (medicines.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-pills"></i>
                <p>No medicine records available</p>
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    medicines.forEach(medicine => {

        let badgeClass = "badge-success";

        if (medicine.status === "Low Stock") {
            badgeClass = "badge-warning";
        }

        if (medicine.status === "Out of Stock") {
            badgeClass = "badge-danger";
        }


        list.innerHTML += `

            <div class="list-item">

                <div>

                    <h4>
                        ${medicine.name}
                    </h4>

                    <p>
                        Quantity: ${medicine.quantity}
                    </p>

                </div>

                <span class="badge ${badgeClass}">
                    ${medicine.status}
                </span>

            </div>

        `;

    });

}



document.getElementById("followupForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const followup = {

            patient:
                document.getElementById("followupPatient").value,

            category:
                document.getElementById("riskCategory").value,

            date:
                document.getElementById("followupDate").value,

            priority:
                document.getElementById("riskPriority").value

        };


        followups.push(followup);

        renderFollowups();

        updateDashboard();

        this.reset();

        showToast("High-risk follow-up added");

    });


function renderFollowups() {

    const list =
        document.getElementById("followupList");


    if (followups.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-user-shield"></i>
                <p>No high-risk follow-ups added</p>
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    followups.forEach(followup => {

        let badgeClass = "badge-warning";

        if (followup.priority === "Critical") {
            badgeClass = "badge-danger";
        }


        list.innerHTML += `

            <div class="list-item">

                <div>

                    <h4>
                        ${followup.patient}
                    </h4>

                    <p>
                        ${followup.category}
                    </p>

                    <p>
                        Follow-up: ${followup.date}
                    </p>

                </div>

                <span class="badge ${badgeClass}">
                    ${followup.priority}
                </span>

            </div>

        `;

    });

}




function sendEmergencyAlert() {

    const patient =
        document.getElementById("emergencyPatient").value;

    const description =
        document.getElementById("emergencyDescription").value;


    if (!patient || !description) {

        showToast(
            "Please enter patient information and emergency details"
        );

        return;

    }


    showToast(
        "Emergency escalation request recorded. Contact emergency services immediately."
    );


    document.getElementById("emergencyPatient").value = "";
    document.getElementById("emergencyDescription").value = "";

}




function updateDashboard() {

    document.getElementById("totalPatients").innerText =
        patients.length;


    document.getElementById("todayAppointments").innerText =
        appointments.length;


    document.getElementById("highRiskCount").innerText =
        followups.length;


    document.getElementById("pendingReferrals").innerText =
        referrals.length;


    const totalTasks =
        appointments.length +
        referrals.length +
        followups.length;


    document.getElementById("taskCount").innerText =
        totalTasks + " Tasks";

}




function checkConnection() {

    function updateStatus() {

        const status =
            navigator.onLine ? "Online" : "Offline";

        document.getElementById("networkStatus").innerText =
            status;

    }


    updateStatus();

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

}



function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.innerText = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}



function logoutSystem() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (confirmLogout) {

        showToast(
            "You have been logged out successfully"
        );

    }

}



const translations = {

    en: {

        healthWorker: "Health Worker",
        dashboard: "Dashboard",
        patients: "Patients",
        triage: "Digital Triage",
        appointments: "Appointments & Queue",
        teleconsultation: "Teleconsultation",
        referrals: "Referral Tracking",
        diagnostics: "Diagnostics",
        medicine: "Medicine Availability",
        followup: "High-Risk Follow-up",
        emergency: "Emergency",
        online: "System Online",
        logout: "Logout",

        welcome: "Welcome to SwasthyaSetu",

        welcomeText:
            "Manage patient care, referrals, appointments and community healthcare services efficiently.",

        registerPatient: "Register New Patient",
        totalPatients: "Total Patients",
        todayAppointments: "Today's Appointments",
        highRisk: "High-Risk Follow-ups",
        pendingReferrals: "Pending Referrals",
        quickActions: "Quick Actions",
        addPatient: "Add Patient",
        startTriage: "Start Triage",
        bookAppointment: "Book Appointment",
        createReferral: "Create Referral",
        todayTasks: "Today's Tasks",
        facilityOverview: "Facility Overview",
        connectivity: "Connectivity",
        records: "Digital Records",
        languageSupport: "Language Support",
        careQuality: "Care Quality",

        patientManagement: "Patient Management",
        name: "Name",
        age: "Age",
        gender: "Gender",
        contact: "Contact",
        status: "Status",
        action: "Action",

        digitalTriage: "Digital Triage",
        patientName: "Patient Name",
        symptoms: "Symptoms",
        notes: "Additional Notes",
        submitTriage: "Submit Triage Assessment",

        appointmentsQueue: "Appointments & Queue",
        referralTracking: "Referral Tracking",
        medicineAvailability: "Medicine Availability",
        highRiskFollowup: "High-Risk Patient Follow-up",
        emergencyEscalation: "Emergency Escalation"

    },


    bn: {

        healthWorker: "স্বাস্থ্যকর্মী",
        dashboard: "ড্যাশবোর্ড",
        patients: "রোগী",
        triage: "ডিজিটাল ট্রায়াজ",
        appointments: "অ্যাপয়েন্টমেন্ট ও কিউ",
        teleconsultation: "টেলিকনসালটেশন",
        referrals: "রেফারেল ট্র্যাকিং",
        diagnostics: "ডায়াগনস্টিকস",
        medicine: "ওষুধের প্রাপ্যতা",
        followup: "উচ্চ ঝুঁকির ফলো-আপ",
        emergency: "জরুরি",
        online: "সিস্টেম অনলাইন",
        logout: "লগআউট",

        welcome: "স্বাস্থ্যসেতুতে স্বাগতম",

        welcomeText:
            "রোগীর যত্ন, রেফারেল, অ্যাপয়েন্টমেন্ট এবং স্বাস্থ্যসেবা সহজভাবে পরিচালনা করুন।",

        registerPatient: "নতুন রোগী নিবন্ধন",
        totalPatients: "মোট রোগী",
        todayAppointments: "আজকের অ্যাপয়েন্টমেন্ট",
        highRisk: "উচ্চ ঝুঁকির ফলো-আপ",
        pendingReferrals: "অপেক্ষমাণ রেফারেল",
        quickActions: "দ্রুত কার্যক্রম",
        addPatient: "রোগী যোগ করুন",
        startTriage: "ট্রায়াজ শুরু করুন",
        bookAppointment: "অ্যাপয়েন্টমেন্ট করুন",
        createReferral: "রেফারেল তৈরি করুন",
        todayTasks: "আজকের কাজ",
        facilityOverview: "স্বাস্থ্যকেন্দ্রের তথ্য",
        connectivity: "সংযোগ",
        records: "ডিজিটাল রেকর্ড",
        languageSupport: "ভাষা সহায়তা",
        careQuality: "চিকিৎসার মান",

        patientManagement: "রোগী ব্যবস্থাপনা",
        name: "নাম",
        age: "বয়স",
        gender: "লিঙ্গ",
        contact: "যোগাযোগ",
        status: "অবস্থা",
        action: "কাজ",

        digitalTriage: "ডিজিটাল ট্রায়াজ",
        patientName: "রোগীর নাম",
        symptoms: "উপসর্গ",
        notes: "অতিরিক্ত তথ্য",
        submitTriage: "ট্রায়াজ জমা দিন",

        appointmentsQueue: "অ্যাপয়েন্টমেন্ট ও কিউ",
        referralTracking: "রেফারেল ট্র্যাকিং",
        medicineAvailability: "ওষুধের প্রাপ্যতা",
        highRiskFollowup: "উচ্চ ঝুঁকির রোগীর ফলো-আপ",
        emergencyEscalation: "জরুরি সহায়তা"

    },


    hi: {

        healthWorker: "स्वास्थ्य कार्यकर्ता",
        dashboard: "डैशबोर्ड",
        patients: "मरीज़",
        triage: "डिजिटल ट्रायेज",
        appointments: "अपॉइंटमेंट और कतार",
        teleconsultation: "टेलीकंसल्टेशन",
        referrals: "रेफरल ट्रैकिंग",
        diagnostics: "जांच",
        medicine: "दवा उपलब्धता",
        followup: "उच्च जोखिम फॉलो-अप",
        emergency: "आपातकाल",
        online: "सिस्टम ऑनलाइन",
        logout: "लॉगआउट",

        welcome: "स्वास्थ्यसेतु में आपका स्वागत है",

        welcomeText:
            "रोगी देखभाल, रेफरल और स्वास्थ्य सेवाओं को आसानी से प्रबंधित करें।",

        registerPatient: "नया मरीज पंजीकरण",
        totalPatients: "कुल मरीज",
        todayAppointments: "आज की अपॉइंटमेंट",
        highRisk: "उच्च जोखिम फॉलो-अप",
        pendingReferrals: "लंबित रेफरल",
        quickActions: "त्वरित कार्य",
        addPatient: "मरीज जोड़ें",
        startTriage: "ट्रायेज शुरू करें",
        bookAppointment: "अपॉइंटमेंट बुक करें",
        createReferral: "रेफरल बनाएं",
        todayTasks: "आज के कार्य",
        facilityOverview: "स्वास्थ्य केंद्र जानकारी",
        connectivity: "कनेक्टिविटी",
        records: "डिजिटल रिकॉर्ड",
        languageSupport: "भाषा सहायता",
        careQuality: "देखभाल की गुणवत्ता",

        patientManagement: "मरीज प्रबंधन",
        name: "नाम",
        age: "आयु",
        gender: "लिंग",
        contact: "संपर्क",
        status: "स्थिति",
        action: "कार्य",

        digitalTriage: "डिजिटल ट्रायेज",
        patientName: "मरीज का नाम",
        symptoms: "लक्षण",
        notes: "अतिरिक्त जानकारी",
        submitTriage: "ट्रायेज जमा करें",

        appointmentsQueue: "अपॉइंटमेंट और कतार",
        referralTracking: "रेफरल ट्रैकिंग",
        medicineAvailability: "दवा उपलब्धता",
        highRiskFollowup: "उच्च जोखिम मरीज फॉलो-अप",
        emergencyEscalation: "आपातकालीन सहायता"

    },


    mr: {

        healthWorker: "आरोग्य कर्मचारी",
        dashboard: "डॅशबोर्ड",
        patients: "रुग्ण",
        triage: "डिजिटल ट्रायेज",
        appointments: "अपॉइंटमेंट आणि रांग",
        teleconsultation: "टेलीकन्सल्टेशन",
        referrals: "रेफरल ट्रॅकिंग",
        diagnostics: "निदान",
        medicine: "औषध उपलब्धता",
        followup: "उच्च जोखीम फॉलो-अप",
        emergency: "आपत्कालीन",
        online: "सिस्टम ऑनलाइन",
        logout: "लॉगआउट",

        welcome: "स्वास्थ्यसेतूमध्ये आपले स्वागत आहे",

        welcomeText:
            "रुग्ण सेवा, रेफरल आणि आरोग्य सेवा प्रभावीपणे व्यवस्थापित करा.",

        registerPatient: "नवीन रुग्ण नोंदणी",
        totalPatients: "एकूण रुग्ण",
        todayAppointments: "आजच्या अपॉइंटमेंट",
        highRisk: "उच्च जोखीम फॉलो-अप",
        pendingReferrals: "प्रलंबित रेफरल",
        quickActions: "त्वरित क्रिया",
        addPatient: "रुग्ण जोडा",
        startTriage: "ट्रायेज सुरू करा",
        bookAppointment: "अपॉइंटमेंट बुक करा",
        createReferral: "रेफरल तयार करा",
        todayTasks: "आजची कामे",
        facilityOverview: "आरोग्य केंद्र माहिती",
        connectivity: "कनेक्टिव्हिटी",
        records: "डिजिटल रेकॉर्ड",
        languageSupport: "भाषा समर्थन",
        careQuality: "सेवा गुणवत्ता",

        patientManagement: "रुग्ण व्यवस्थापन",
        name: "नाव",
        age: "वय",
        gender: "लिंग",
        contact: "संपर्क",
        status: "स्थिती",
        action: "कृती",

        digitalTriage: "डिजिटल ट्रायेज",
        patientName: "रुग्णाचे नाव",
        symptoms: "लक्षणे",
        notes: "अतिरिक्त माहिती",
        submitTriage: "ट्रायेज सबमिट करा",

        appointmentsQueue: "अपॉइंटमेंट आणि रांग",
        referralTracking: "रेफरल ट्रॅकिंग",
        medicineAvailability: "औषध उपलब्धता",
        highRiskFollowup: "उच्च जोखीम रुग्ण फॉलो-अप",
        emergencyEscalation: "आपत्कालीन मदत"

    }

};



function changeLanguage() {

    const language =
        document.getElementById("languageSelector").value;


    document.querySelectorAll("[data-lang]")
        .forEach(element => {

            const key =
                element.getAttribute("data-lang");


            if (translations[language][key]) {

                element.innerText =
                    translations[language][key];

            }

        });


    document.documentElement.lang = language;

}
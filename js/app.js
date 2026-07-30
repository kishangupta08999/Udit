import {
    db,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";

let currentDate = new Date();
let attendance = {};
let selectedDate = "";
const calendarDays = document.getElementById("calendarDays");
const modal=document.getElementById("attendanceModal");

const modalDate=document.getElementById("modalDate");

const statusSelect=document.getElementById("statusSelect");

const remarkText=document.getElementById("remarkText");
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const monthSelect=document.getElementById("monthSelect");

const yearSelect=document.getElementById("yearSelect");

// ===================== Load Attendance =====================
async function loadAttendance() {

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    const documentId = `${year}-${month}`;

    const ref = doc(db, "attendance", documentId);

    const snap = await getDoc(ref);

    if (snap.exists()) {
        attendance = snap.data().dates || {};
    } else {
        attendance = {};
    }
}

// ===================== Save Attendance =====================
async function saveAttendance() {

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    const documentId = `${year}-${month}`;

    const ref = doc(db, "attendance", documentId);

    await setDoc(ref, {
        dates: attendance
    });

}

// ===================== Calendar =====================
function renderCalendar() {

    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();


    const firstDay = new Date(year, month, 1).getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty Cells
    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");
        empty.className = "day empty";

        calendarDays.appendChild(empty);

    }

    // Dates
    for (let day = 1; day <= totalDays; day++) {

        const div = document.createElement("div");

        div.className = "day";

        div.innerHTML = day;

        const key =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Today Highlight
        const today = new Date();

        if (
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
        ) {
            div.classList.add("today");
        }

        // Attendance Highlight
        const record=attendance[key];

if(record){

if(record.present){

div.classList.add("attendance");

}

if(record.holiday){

div.style.background="#ef4444";

div.style.color="#fff";

}

if(record.note){

const icon=document.createElement("span");

icon.className="note-icon";

icon.innerHTML="📝";

div.appendChild(icon);

}

}

        // Click Event
        div.addEventListener("click",()=>{

openModal(key);

});

div.addEventListener("dblclick",async()=>{

    const old = attendance[key] || {

        present:false,
        holiday:false,
        note:""

    };

    const note = prompt("Remark / Note",old.note);

    if(note===null)
        return;

    old.note=note;

    attendance[key]=old;

    await saveAttendance();

    renderCalendar();

});

div.addEventListener("contextmenu",async(e)=>{

e.preventDefault();

const old=attendance[key]||{

present:false,
holiday:false,
note:""

};

old.holiday=!old.holiday;

attendance[key]=old;

await saveAttendance();

renderCalendar();

});

     calendarDays.appendChild(div);
       
    }
monthSelect.value=currentDate.getMonth();

yearSelect.value=currentDate.getFullYear();

updateSummary();

}

// ===================== Previous Month =====================
document.getElementById("prevBtn").addEventListener("click", async () => {

    currentDate.setMonth(currentDate.getMonth() - 1);

    await loadAttendance();

    renderCalendar();

});

// ===================== Next Month =====================
document.getElementById("nextBtn").addEventListener("click", async () => {

    currentDate.setMonth(currentDate.getMonth() + 1);

    await loadAttendance();

    renderCalendar();

});

// ===================== Initial Load =====================
(async () => {
fillDropdowns();
    await loadAttendance();

    renderCalendar();

})();

function fillDropdowns(){

monthSelect.innerHTML="";

months.forEach((m,index)=>{

let option=document.createElement("option");

option.value=index;

option.text=m;

monthSelect.appendChild(option);

});

for(let y=2020;y<=2040;y++){

let option=document.createElement("option");

option.value=y;

option.text=y;

yearSelect.appendChild(option);

}

}

function updateSummary(){

const present=Object.keys(attendance).length;

const year=currentDate.getFullYear();

const month=currentDate.getMonth();

const total=new Date(year,month+1,0).getDate();

const percent=((present/total)*100).toFixed(1);

document.getElementById("presentCount").innerHTML=present;

document.getElementById("totalDays").innerHTML=total;

document.getElementById("attendancePercent").innerHTML=percent+"%";

}
monthSelect.addEventListener("change",async()=>{

currentDate.setMonth(Number(monthSelect.value));

await loadAttendance();

renderCalendar();

});
yearSelect.addEventListener("change",async()=>{

currentDate.setFullYear(Number(yearSelect.value));

await loadAttendance();

renderCalendar();

});
document.getElementById("todayBtn").addEventListener("click",async()=>{

currentDate=new Date();

await loadAttendance();

renderCalendar();

});

function openModal(date){

selectedDate=date;

modal.classList.add("show");

modalDate.innerHTML=date;

const data=attendance[date]||{

present:false,

holiday:false,

note:""

};

if(data.present)

statusSelect.value="present";

else if(data.holiday)

statusSelect.value="holiday";



remarkText.value=data.note||"";

}
function closeModal(){

modal.classList.remove("show");

}

document.getElementById("closeModal").onclick=closeModal;
document.getElementById("saveBtn").onclick=async()=>{

attendance[selectedDate]={

present:statusSelect.value==="present",

holiday:statusSelect.value==="holiday",

note:remarkText.value.trim()

};

await saveAttendance();

closeModal();

renderCalendar();

};
document.getElementById("deleteBtn").onclick=async()=>{

delete attendance[selectedDate];

await saveAttendance();

closeModal();

renderCalendar();

};
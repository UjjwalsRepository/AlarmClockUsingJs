const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#setAlarm");
const alarmContainer = document.querySelector("#alarms-container");
let ringtone = new Audio("./files/ringtone.mp3");

// Adding Hours, Minutes, Seconds in Select Menu
window.addEventListener("DOMContentLoaded", (event) => {
  selectDropdown(1, 12, setHours);
  selectDropdown(0, 59, setMinutes);
  selectDropdown(0, 59, setSeconds);
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Setting Alarm
setAlarmButton.addEventListener("click", getValue);
function selectDropdown(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}


function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}


function getValue(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}


function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      ringtone.play();
      ringtone.loop = true;
      document.querySelector(".stop-alarm").style.display = "block";
    }
    
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}


function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("delete-alarm-time");
  alarm.innerHTML = `
              <div class="alarm-time">${time}</div>
              <button class="delete-alarm" data-id=${intervalId}>Delete</button>
              <button class="stop-alarm" data-id=${intervalId}>Stop</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  const stopButton = alarm.querySelector(".stop-alarm");
  stopButton.addEventListener("click", (e) => stopAlarm());

  alarmContainer.prepend(alarm);
}


function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}


function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}


function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  deleteAlarmFromLocal(time);
  alarm.remove();
}

function stopAlarm(){
  ringtone.pause();
  document.querySelector(".stop-alarm").style.display = "none";
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
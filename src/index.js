// <⚠️ DONT DELETE THIS ⚠️>
//import "./styles.css";
// <⚠️ /DONT DELETE THIS ⚠️>
const inputForm = document.querySelector(".inputForm")
const toDoInput = inputForm.querySelector("input")
const pendingList = document.querySelector(".pendingList")
const finishedList = document.querySelector(".finishedList")
const form = document.querySelector(".js-form");
const input =form.querySelector("input");
const gretting = document.querySelector(".js-grettings")
const body = document.querySelector("body")
const weather = document.querySelector(".js-weather")
const USER_LS = "currentUser";
const SHOWING_ON = "showing";
const COORDS = "coords";
let pending = []
let finished = []
const PENDING_LS = "pending"
const FINISHED_LS = "finished"
const IMG_NUMBER = 3;
const API_KEY = "88ad8db4893bbc3abbc1002d0cb2ffbd";

function checkPending(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const span = li.querySelector("span").innerText
  paintFinished(span);
  deletePending(event);
}

function saveFinished() {
  localStorage.setItem(FINISHED_LS, JSON.stringify(finished));
}

function deleteFinished(event) {
  const btn = event.target;
  const li = btn.parentNode;
  finishedList.removeChild(li);
  const cleanfinished = finished.filter(function(toDo) {
    return toDo.id !== li.id;
  });
  finished = cleanfinished;
  saveFinished();
}

function reFinished(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const span = li.querySelector("span").innerText
  paintPending(span);
  deleteFinished(event);
}

function paintFinished(text, id) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const reBtn = document.createElement("button");
  const span = document.createElement("span");
  const time = new Date();
  const newId = time.getTime();
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteFinished);
  reBtn.innerText = "⏪";
  reBtn.addEventListener("click", reFinished);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(reBtn);
  finishedList.appendChild(li);
  if(typeof id == "undefined" || null || ""){
    li.id = newId;
  }
  else{
    li.id = parseInt(id);
  }
  
  const finishedObj = {
    text: text,
    id: li.id
  };
  finished.push(finishedObj);
  saveFinished();
}

function deletePending(event) {
  const btn = event.target;
  const li = btn.parentNode;
  pendingList.removeChild(li);
  const cleanpending = pending.filter(function(toDo) {
    return toDo.id !== li.id;
  });
  pending = cleanpending;
  savePending();
}

function savePending() {
  localStorage.setItem(PENDING_LS, JSON.stringify(pending));
}

function paintPending(text, id) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const checkBtn = document.createElement("button");
  const span = document.createElement("span");
  const time = new Date();
  const newId = time.getTime();
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deletePending);
  checkBtn.innerText = "✅";
  checkBtn.addEventListener("click", checkPending);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(checkBtn);
  pendingList.appendChild(li);
  if(typeof id == "undefined" || null || ""){
    li.id = newId;
  }
  else{
    li.id = parseInt(id);
  }
  const pendingObj = {
    text: text,
    id: li.id
  };
  pending.push(pendingObj);
  savePending();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintPending(currentValue);
  toDoInput.value = null;
}

function loadPending() {
  const loadedPending = localStorage.getItem(PENDING_LS);
  if(loadedPending !== null){
     const pendingLs = JSON.parse(loadedPending);
     //저장은 스트링 값으로 불러올때는 스트링을 obj값으로
     pendingLs.forEach(function(toDo) {
      paintPending(toDo.text, toDo.id);
     });
  }
}

function loadFinished() {
  const loadedFinished = localStorage.getItem(FINISHED_LS);
  if(loadedFinished !== null){
     const finishedLs = JSON.parse(loadedFinished);
     //저장은 스트링 값으로 불러올때는 스트링을 obj값으로
     finishedLs.forEach(function(toDo) {
      paintFinished(toDo.text, toDo.id);
     });
  }
}
const clockContainer = document.querySelector(".js-clock");
const clockTitle = clockContainer.querySelector("h1");

function getTime(){
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds();
    clockTitle.innerText = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function saveName(text){
  localStorage.setItem(USER_LS, text);
}

function handleSubmitName(event) {
  event.preventDefault();
  const currentValue = input.value;
  paintGreeting(currentValue);
  saveName(currentValue);
}

function askForName(){
  form.classList.add(SHOWING_ON);
  form.addEventListener("submit", handleSubmitName);
}

function paintGreeting(text){
  form.classList.remove(SHOWING_ON);
  gretting.classList.add(SHOWING_ON);
  gretting.innerText = `Hello ${text}`;
}

function loadName(){
  const currentUser = localStorage.getItem(USER_LS);
  if(currentUser === null){
      askForName();
 } else{
      paintGreeting(currentUser);
 }
}

function paintImage(imgNumber) {
  const image = new Image();
  image.src = `src/${imgNumber + 1}.jpg`;
  image.classList.add("bgImage");
  body.prepend(image);
}

function genRandom() {
  const number = Math.floor(Math.random() * IMG_NUMBER);
  return number;
}

function getWeather(lat, lon){
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
  .then(function(response){
    return response.json();

  }).then(function(json){
    const temp = json.main.temp;
    const place = json.name;
    weather.innerText = `${place} ${temp}℃`;
  });
}

function saveCoords(coordsObj){
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSucces(position){
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude
  };
  saveCoords(coordsObj);
  getWeather(latitude, longitude);
}

function handleGeoError(){
}

function askForCoords(){
  navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);

}

function loadCoords(){
  const loadedCords = localStorage.getItem(COORDS);
  if(loadedCords === null){
    askForCoords();
  }else{
    const parseCoords = JSON.parse(loadedCords);
    getWeather(parseCoords.latitude, parseCoords.longitude);
  }
}

function init (){
  getTime();
  setInterval(getTime, 1000);
  loadCoords();
  loadName();
  loadPending();
  loadFinished();
  inputForm.addEventListener("submit", handleSubmit);
  const randomNumber = genRandom();
  paintImage(randomNumber);
}

init ();

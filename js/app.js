const input = document.getElementById("input");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const startBtn = document.getElementById("startBtn");
const addRowButton = document.getElementById("addRowButton");
const dataTable = document.getElementById("dataTable");
const volumeSlider = document.getElementById("volumeSlider");
const consoleOutput = document.getElementById("consoleOutput");
const currentWorkLabel = document.getElementById("currentWorkLabel");
const currentWorkDetailLabel = document.getElementById("currentWorkDetailLabel");
const currentProgressBar = document.getElementById("currentProgressBar");

const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");


var loadData;
var timer = 0;
var currentWorkTime = -1;
var _date = new Date();
var _workArr = [];
var timerId = 0;
var _recordChildList = [];
var workIndex = 0;

window.onload = function () {
    $(document).ready(init);
}

function init() {
    consoleAdd("v0.0.2");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://script.google.com/macros/s/AKfycbx7_N9Et7WblpE4q-HHeVPN-UFgZGp5VJtPficQI_TbQNxHocSHbG4Yt7ycuyxcnqni/exec', true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            loadData = JSON.parse(this.responseText);
            reload();
        }
    };
    xhr.send();

}

backBtn.addEventListener("click", function () {
    indexControll(true);
});
forwardBtn.addEventListener("click", function () {
    indexControll(false);
});
function indexControll(isBack) {
    _recordChildList[workIndex].className = "";
    workIndex += isBack ? -1 : 1;
    workIndex = Math.max(0, workIndex);
    setWork();
}


function reload() {

    consoleAdd("init")
    consoleAdd(JSON.stringify(loadData));

    // timer = 0;
    // currentWorkTime = -1;
    // _date = new Date();
    // _workArr = [];
    // timerId = 0;
    consoleAdd(_recordChildList.length);
    loadData["work"].forEach(element => {
        consoleAdd(JSON.stringify(element));
        setUnit(element);
    });
}

speakBtn.addEventListener("click", function () {
    startWork();
    speakBtn.disabled = true;
    speakBtn.innerText = "実行中";
    pauseBtn.disabled = false;
});

if (pauseBtn != null) {
    pauseBtn.addEventListener("click", function () {
        if (currentWorkTime == -1) {
            return;
        }
        if (timerId != 0) {
            clearInterval(timerId);
            timerId = 0;
            pauseBtn.innerText = "pausing";
            speakFunc("pauseしました");
        } else {
            pauseBtn.innerText = "pauseBtn";
            timerId = setInterval(logEverySecond, 1000);
            speakFunc("再開しました");
        }
    });
}


if (startBtn != null) {
    startBtn.addEventListener("click", function () {
        const seconds = 3;//parseInt(timerInput.value);
        if (isNaN(seconds)) {
            alert("Please enter a valid number of seconds");
        } else {
            // Calculate the timeout in milliseconds
            const timeout = seconds * 1000;
            // Set a timer to display an alert after the specified time has elapsed
            setTimeout(function () {
                speakFunc(seconds + "秒 経過");
            }, timeout);
        }
    });
}

if (addRowButton != null) {
    addRowButton.addEventListener("click", function () {
        setUnit({ no: 1, name: 1, time: 1 });
    });
}


function setUnit(obj) {

    const newRow = document.createElement('tr');
    _workArr.push(obj);

    const checkColumn = document.createElement("td");
    checkColumn.innerHTML = '<input type="checkbox" style=" transform: translate(5px, 2px) ;">';


    const noColumn = document.createElement("td");
    noColumn.innerText = _workArr.length//obj["no"];

    const nameColumn = document.createElement("td");
    nameColumn.innerText = obj["name"];

    const timeColumn = document.createElement("td");
    timeColumn.innerText = obj["time"];

    const startDatteColumn = document.createElement("td");
    startDatteColumn.innerText = _date.toLocaleTimeString();
    _date.setSeconds(_date.getSeconds() + timeToSeconds(obj["time"]));
    const delColumn = document.createElement("td");
    delColumn.innerHTML = '<button onclick="deleteRow(this.parentNode)">❌</button>'
    newRow.appendChild(checkColumn);
    newRow.appendChild(noColumn);
    newRow.appendChild(nameColumn);
    newRow.appendChild(timeColumn);
    newRow.appendChild(startDatteColumn);
    newRow.appendChild(delColumn);

    _recordChildList.push(newRow)
    dataTable.tBodies[0].appendChild(newRow);
}
function deleteRow(button) {
    var row = button.parentNode;
    consoleAdd(row);
    row.parentNode.removeChild(row);
}

function setWork() {
    if (_workArr.length < workIndex) {
        speakFunc("終わりです。おつかれさまでした")
        clearInterval(timerId)
        return;
    }
    timer = 0;
    currentProgressBar.style.width = "0%";
    var element = _workArr[workIndex]
    _recordChildList[workIndex].className = "table-warning";
    currentWorkTime = timeToSeconds(element["time"]);
    currentWorkDetailLabel.innerText = _workArr[workIndex]["name"] + " " + formatSeconds(currentWorkTime - timer);
    speakFunc(element["name"] + "を" + element["time"] + "行う")
}

function startWork() {
    if (timerId != 0) {
        consoleAdd("既にスタートしてます");
        return;
    }
    consoleAdd("startWork");
    setWork();
    timerId = setInterval(logEverySecond, 1000);
}

function logEverySecond() {

    timer += 1;
    currentWorkDetailLabel.innerText = _workArr[workIndex]["name"] + " " + formatSeconds(currentWorkTime - timer);
    currentProgressBar.style.width = timer / currentWorkTime * 100 + "%";
    if (timer > currentWorkTime) {
        _recordChildList[workIndex].className = "";
        workIndex += 1;
        setWork();
        return;
    }
    if ((currentWorkTime - timer) % 5 == 0) {
        var sec = secondsToTime(currentWorkTime - timer);
        if (sec == "0秒") return;
        speakFunc("残り" + sec);
    }
}

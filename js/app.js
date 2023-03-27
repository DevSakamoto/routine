const input = document.getElementById("input");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const startBtn = document.getElementById("startBtn");
const addRowButton = document.getElementById("addRowButton");
const dataTable = document.getElementById("dataTable");
const volumeSlider = document.getElementById("volumeSlider");
const consoleOutput = document.getElementById("consoleOutput");
const currentWorkLabel = document.getElementById("currentWorkLabel");
const currentWorDetailkLabel = document.getElementById("currentWorDetailkLabel");
const currentProgressBar = document.getElementById("currentProgressBar");

var loadData;
var timer = 0;
var currentWorkTime = -1;
var _date = new Date();
var _workArr = [];
var timerId = 0;
var _recordChildList = [];

window.onload = function () {
    $(document).ready(init);
}

function init() {
    // $.getJSON("data/data.json", function (data) {
    //     loadData = data;
    //     reload();
    // });
    consoleAdd("v0.0.1");
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

function reload() {
    consoleAdd("init")
    consoleAdd(JSON.stringify(loadData));

    // timer = 0;
    // currentWorkTime = -1;
    // _date = new Date();
    // _workArr = [];
    // timerId = 0;
    consoleAdd(_recordChildList.length);


    // _recordChildList.forEach(element => {
    //     consoleAdd("deleteRow");
    //     deleteRow(element);
    // });
    // _recordChildList = [];

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
    if (_workArr.length == 0) {
        speakFunc("終わりです。おつかれさまでした")
        clearInterval(timerId)
        return;
    }
    timer = 0;
    currentProgressBar.style.width = "0%";
    var element = _workArr[0]
    _recordChildList[0].className = "table-warning";
    currentWorkLabel.innerText = element["name"];
    currentWorkTime = timeToSeconds(element["time"]);
    currentWorDetailkLabel.innerText = element["name"] + element["time"];
    speakFunc(element["name"] + "を" + element["time"] + "行う")
}

function timeToSeconds(timeString) {
    const regex = /(\d+)\s*(時間|分|秒)?/g;
    let match;
    let totalSeconds = 0;
    while ((match = regex.exec(timeString))) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        if (unit === "時間") {
            totalSeconds += value * 3600;
        } else if (unit === "分") {
            totalSeconds += value * 60;
        } else if (unit === "秒" || !unit) {
            totalSeconds += value;
        }
    }
    consoleAdd(totalSeconds);
    return totalSeconds;
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
    currentProgressBar.style.width = timer / currentWorkTime * 100 + "%";
    if (timer > currentWorkTime) {
        _workArr = _workArr.slice(1);
        _recordChildList[0].className="";
        _recordChildList =_recordChildList.slice(1);
        setWork();
        return;
    }
    if ((currentWorkTime - timer) % 5 == 0) {
        var sec = secondsToTime(currentWorkTime - timer);
        if (sec == "0秒") return;
        speakFunc("残り" + sec);
    }
}
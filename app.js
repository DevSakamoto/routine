const input = document.getElementById("input");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const startBtn = document.getElementById("startBtn");
const addRowButton = document.getElementById("addRowButton");
const dataTable = document.getElementById("dataTable");
const volumeSlider = document.getElementById("volumeSlider");
const consoleOutput = document.getElementById("consoleOutput");
const currentWorkLabel = document.getElementById("currentWorkLabel");
const currentProgressBar = document.getElementById("currentProgressBar");

var timer = 0;
var currentWorkTime = -1;
var _date = new Date();
var _workArr = [];
var timerId = 0;


// Check if the Web Speech API is supported
if ('speechSynthesis' in window) {
    // Add event listener to the speak button
    speakBtn.addEventListener("click", function () {
        startWork();
        speakBtn.disabled = true;
        speakBtn.innerText = "実行中";
        pauseBtn.disabled = false;
    });
} else {
    alert("Sorry, your browser doesn't support the Web Speech API");
}
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

function speakFunc(txt) {
    // Create a new instance of the SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance(txt);
    // Set the voice and rate properties
    utterance.voice = speechSynthesis.getVoices()[0];
    utterance.rate = 1;
    utterance.volume = volumeSlider.value / 100;
    utterance.lang = 'ja-JP';
    // Speak the text
    speechSynthesis.speak(utterance);
    consoleAdd("【音声再生】" + txt)
}



if (addRowButton != null) {
    addRowButton.addEventListener("click", function () {
        setUnit({ no: 1, name: 1, time: 1 });
    });
}


function setUnit(obj) {

    const newRow = document.createElement("tr");

    _workArr.push(obj);

    const noColumn = document.createElement("td");
    noColumn.innerText = obj["no"];

    const nameColumn = document.createElement("td");
    nameColumn.innerText = obj["name"];

    const timeColumn = document.createElement("td");
    timeColumn.innerText = obj["time"];

    const startDatteColumn = document.createElement("td");
    startDatteColumn.innerText = _date.toLocaleTimeString();

    const endDatteColumn = document.createElement("td");
    _date.setSeconds(_date.getSeconds() + timeToSeconds(obj["time"]));
    endDatteColumn.innerText = _date.toLocaleTimeString();

    newRow.appendChild(noColumn);
    newRow.appendChild(nameColumn);
    newRow.appendChild(timeColumn);
    newRow.appendChild(startDatteColumn);
    newRow.appendChild(endDatteColumn);
    dataTable.tBodies[0].appendChild(newRow);
}


function consoleAdd(txt) {
    consoleOutput.value += txt + "\n";
    console.log(txt);
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
    currentWorkLabel.innerText = element["name"];
    currentWorkTime = timeToSeconds(element["time"]);
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
function secondsToTime(seconds) {
    let timeString = "";
    if (seconds >= 3600) {
        timeString += `${Math.floor(seconds / 3600)}時間`;
        seconds %= 3600;
    }
    if (seconds >= 60) {
        timeString += `${Math.floor(seconds / 60)}分`;
        seconds %= 60;
    }
    if (seconds > 0 || timeString === "") {
        timeString += `${seconds}秒`;
    }
    return timeString;
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
    //consoleAdd(timer);
    currentProgressBar.style.width = timer / currentWorkTime * 100 + "%";
    //consoleAdd(currentProgressBar.style.width);

    if (timer > currentWorkTime) {
        _workArr = _workArr.slice(1);
        setWork();
        return;
    }
    if ((currentWorkTime - timer) % 5 == 0) {
        var sec = secondsToTime(currentWorkTime - timer);
        if (sec == "0秒") return;
        speakFunc("残り" + sec);
    }

}

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

/**int -> 日本語表記の　時間　分　秒に変換する関数 */
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
    consoleAdd(timeString);
    return timeString;
}

function consoleAdd(txt) {
    consoleOutput.value += txt + "\n";
    scrollToBottom(consoleOutput);
    console.log(txt);
}

// テキストビューをアニメーション付きで最下部にスクロール
function scrollToBottom(scroolContent) {
    // アニメーションのパラメータを設定
    var start = scroolContent.scrollTop;
    var end = scroolContent.scrollHeight - scroolContent.clientHeight;
    var duration = 500; // アニメーションの時間（ミリ秒）

    // アニメーションの関数を定義
    var startTime = null;
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        var elapsedTime = currentTime - startTime;
        var position = easeInOut(elapsedTime, start, end - start, duration);
        scroolContent.scrollTop = position;
        if (elapsedTime < duration) {
            requestAnimationFrame(animateScroll);
        } else {
            scroolContent.scrollTop = scroolContent.scrollHeight;
        }
    }
    // アニメーションを開始
    function easeInOut(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    requestAnimationFrame(animateScroll);
}

function speakFunc(txt) {
    // Create a new instance of the SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance(txt);
    // Set the voice and rate properties
    utterance.rate = 1;
    utterance.volume = volumeSlider.value / 100;
    // Speak the text
    speechSynthesis.speak(utterance);
    consoleAdd("【音声再生】" + txt)
}
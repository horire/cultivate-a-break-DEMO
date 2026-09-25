//休憩内容のデータ


const breakTypes = [
    {
        name: "散歩",
        time: "10～15分",
        effect: "ストレス軽減・気分転換"
    },

    {
        name: "ストレッチ",
        time: "10～15分",
        effect: "ストレス軽減・気分転換"
    },

    {
        name: "食事",
        time: "20～30分",
        effect: "エネルギー補給・気分転換"
    },

    {
        name: "階段昇降",
        time: "10～15分",
        effect: "軽い運動・気分転換"
    },

    {
        name: "筋トレ",
        time: "5～20分",
        effect: "運動・気分転換"
    }
];



// HTML要素を取得


const breakList =
    document.querySelector("#breakList");

const breakInput =
    document.querySelector("#breakInput");

const addButton =
    document.querySelector("#addButton");

const currentBreakName =
    document.querySelector("#currentBreakName");

const currentBreakTime =
    document.querySelector("#currentBreakTime");

const currentBreakEffect =
    document.querySelector("#currentBreakEffect");

const historyList =
    document.querySelector("#historyList");



//今日の休憩履歴


const breakHistory = [];



//休憩一覧を画面に表示


const displayBreakTypes = () => {

    //一度一覧を空にする
    breakList.innerHTML = "";


    //休憩内容を1つずつ処理
    breakTypes.forEach((breakType, index) => {

        //カードを作成
        const item =
            document.createElement("button");

        //ボタンとして設定
        item.type = "button";

        //CSSクラス
        item.classList.add("break-item");


        //HTMLを設定
        item.innerHTML = `
            <div class="break-item-top">

                <span class="break-name">
                    ${breakType.name}
                </span>

                <span class="break-time">
                    推奨 ${breakType.time}
                </span>

            </div>

            <p class="break-effect">
                ${breakType.effect}
            </p>
        `;


        //クリックされたとき
        item.addEventListener("click", () => {

            selectBreak(index);

        });


        //画面に追加
        breakList.appendChild(item);

    });
}



//休憩内容を選択


const selectBreak = (index) => {

    //選択した休憩を取得
    const selectedBreak =
        breakTypes[index];


    //現在の休憩名を変更
    currentBreakName.textContent =
        selectedBreak.name;


    //推奨時間を変更
    currentBreakTime.textContent =
        selectedBreak.time;


    //効果を変更
    currentBreakEffect.textContent =
        selectedBreak.effect;


    //全ての選択状態を解除
    const items =
        document.querySelectorAll(".break-item");

    items.forEach((item) => {

        item.classList.remove("selected");

    });


    //今クリックされた項目を選択状態にする
    items[index].classList.add("selected");


    //履歴に追加
    addHistory(selectedBreak);
}



//履歴を追加


const addHistory = (breakType) => {

    //履歴に追加
    breakHistory.push(breakType);


    //履歴を表示
    displayHistory();
}



//履歴を画面に表示


const displayHistory = () => {

    //一度空にする
    historyList.innerHTML = "";


    //履歴を1つずつ処理
    breakHistory.forEach((breakType) => {

        const item =
            document.createElement("div");

        item.classList.add("history-item");


        item.innerHTML = `
            <span>
                ${breakType.name}
            </span>

            <span class="history-time">
                ${breakType.time}
            </span>
        `;


        historyList.appendChild(item);

    });
}



//自由に休憩内容を追加


const addBreak = () => {

    //入力された文字を取得
    const name =
        breakInput.value.trim();


    //何も入力されていなければ終了
    if (name === "") {

        return;

    }


    //新しい休憩データを作成
    const newBreak = {

        name: name,

        time: "時間を設定",

        effect: "自分で追加した休憩"

    };


    //配列に追加
    breakTypes.unshift(newBreak);


    //入力欄を空にする
    breakInput.value = "";


    //一覧を更新
    displayBreakTypes();

}



//追加ボタン


addButton.addEventListener("click", () => {

    addBreak();

});



//Enterキーでも追加


breakInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        addBreak();

    }

});



//最初に休憩一覧を表示


displayBreakTypes();



// タイマーの状態

let elapsedSeconds = 0;
let timerId = null;
let isRunning = false;
const flowerImg = document.querySelector("#flowerImg");



// HTML要素を取得

const timerDisplay = document.querySelector("#timer");
const timerStatus = document.querySelector("#timer-status");

const startButton = document.querySelector("#startButton");
const buttonIcon = document.querySelector("#buttonIcon");

const resetButton = document.querySelector("#resetButton");



// 時間を「00:00」形式にする

const formatTime = (seconds) => {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");

    const formattedSeconds =
        String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}



// タイマー表示を更新

const updateDisplay = () => {

    timerDisplay.textContent =
        formatTime(elapsedSeconds);
}



// タイマー開始ko

const startTimer = () => {

    // すでに動いていたら何もしない
    if (isRunning) {
        return;
    }

    isRunning = true;

    timerStatus.textContent = "休憩中";

    // 再生マーク → 一時停止マーク
    buttonIcon.textContent = "Ⅱ";

    timerId = setInterval(() => {

        elapsedSeconds++;

        updateDisplay();
        change();

    }, 1000);
}



// タイマー一時停止

const pauseTimer = () => {

    if (!isRunning) {
        return;
    }

    isRunning = false;

    clearInterval(timerId);

    timerStatus.textContent = "休憩一時停止";

    // 一時停止マーク → 再生マーク
    buttonIcon.textContent = "▶";
}



// スタートボタン

startButton.addEventListener("click", () => {

    if (isRunning) {

        pauseTimer();

    } else {

        startTimer();

    }

});



// リセットko

resetButton.addEventListener("click", () => {

    // タイマー停止
    clearInterval(timerId);

    isRunning = false;

    // 時間を0に戻す
    elapsedSeconds = 0;

    // 表示を更新
    updateDisplay();

    // 状態を戻す
    timerStatus.textContent = "休憩開始";

    // ボタンを再生マークに戻す
    buttonIcon.textContent = "▶";

    illustReset();

});

const change = () => {
    if (elapsedSeconds <= 9) {
        flowerImg.src = "images/イラスト土.jpg"
    } else {
        flowerImg.src = "images/イラスト芽.jpg"

    }
}

const illustReset = () => {
    flowerImg.src = "images/イラスト土.jpg"
}
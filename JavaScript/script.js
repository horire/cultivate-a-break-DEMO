// ========================================
// 休憩内容のデータ
// ========================================

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


// ========================================
// HTML要素を取得
// ========================================

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


// ========================================
// 左側メニュー
// ========================================

const menuToggle =
    document.querySelector("#menuToggle");

const menuArrow =
    document.querySelector("#menuArrow");

const breakMenu =
    document.querySelector("#breakMenu");


// メニューを開閉
const toggleMenu = () => {

    const isOpen =
        document.body.classList.toggle("menu-open");


    // aria属性を更新
    menuToggle.setAttribute(
        "aria-expanded",
        isOpen
    );

    breakMenu.setAttribute(
        "aria-hidden",
        !isOpen
    );


    // 矢印を変更
    if (isOpen) {

        menuArrow.textContent = "←";

        menuToggle.setAttribute(
            "aria-label",
            "休憩メニューを閉じる"
        );

    } else {

        menuArrow.textContent = "→";

        menuToggle.setAttribute(
            "aria-label",
            "休憩メニューを開く"
        );
    }
};


// 初期状態はメニューを開く
document.body.classList.add("menu-open");

menuToggle.setAttribute(
    "aria-expanded",
    "true"
);

breakMenu.setAttribute(
    "aria-hidden",
    "false"
);

menuArrow.textContent = "←";

menuToggle.setAttribute(
    "aria-label",
    "休憩メニューを閉じる"
);


// タップ・クリックで開閉
menuToggle.addEventListener(
    "click",
    toggleMenu
);


// ========================================
// 今日の休憩履歴
// ========================================

const breakHistory = [];


// ========================================
// 休憩一覧を画面に表示
// ========================================

const displayBreakTypes = () => {

    // 一度一覧を空にする
    breakList.innerHTML = "";


    // 休憩内容を1つずつ処理
    breakTypes.forEach((breakType, index) => {

        // カードを作成
        const item =
            document.createElement("button");


        // ボタンとして設定
        item.type = "button";


        // CSSクラス
        item.classList.add(
            "break-item"
        );


        // HTMLを設定
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


        // クリックされたとき
        item.addEventListener(
            "click",
            () => {

                selectBreak(index);

            }
        );


        // 画面に追加
        breakList.appendChild(item);

    });
};


// ========================================
// 休憩内容を選択
// ========================================

const selectBreak = (index) => {

    //選択した休憩を取得
    const selectedBreak =
        breakTypes[index];


    // --------------------------------
    // 直前の休憩の経過時間を記録
    // --------------------------------

    if (breakHistory.length > 0) {

        const lastHistory =
            breakHistory[breakHistory.length - 1];

        // まだ時間が記録されていない場合のみ記録
        if (lastHistory.elapsedTime === null) {

            lastHistory.elapsedTime =
                formatTime(elapsedSeconds);

        }

    }


    // --------------------------------
    // 現在の休憩名を変更
    // --------------------------------

    currentBreakName.textContent =
        selectedBreak.name;


    isBreakSelected = true;

    startButton.disabled = false;
    pauseButton.disabled = false;


    // 推奨時間を変更
    currentBreakTime.textContent =
        selectedBreak.time;


    // 効果を変更
    currentBreakEffect.textContent =
        selectedBreak.effect;


    // --------------------------------
    // 全ての選択状態を解除
    // --------------------------------

    const items =
        document.querySelectorAll(".break-item");

    items.forEach((item) => {

        item.classList.remove("selected");

    });


    // 今クリックされた項目を選択状態にする
    items[index].classList.add("selected");


    // --------------------------------
    // 新しい休憩を履歴に追加
    // --------------------------------

    addHistory(selectedBreak);

};


// ========================================
// 履歴を追加
// ========================================

const addHistory = (breakType) => {

    // 履歴用のデータを作成
    const historyData = {

        name: breakType.name,

        time: breakType.time,

        effect: breakType.effect,

        // 最初は「-」
        elapsedTime: null

    };


    // 履歴に追加
    breakHistory.push(historyData);


    // 履歴を表示
    displayHistory();

};


// ========================================
// 履歴を画面に表示
// ========================================

const displayHistory = () => {

    // 一度空にする
    historyList.innerHTML = "";


    // 履歴を1つずつ処理
    breakHistory.forEach((breakType) => {

        const item =
            document.createElement("div");


        item.classList.add(
            "history-item"
        );


        item.innerHTML = `
            <span>
                ${breakType.name}
            </span>

            <span class="history-time">
                ${breakType.elapsedTime === null
                ? "-"
                : breakType.elapsedTime}
            </span>
        `;


        historyList.appendChild(item);

    });
};


// ========================================
// 自由に休憩内容を追加
// ========================================

const addBreak = () => {

    // 入力された文字を取得
    const name =
        breakInput.value.trim();


    // 何も入力されていなければ終了
    if (name === "") {
        return;
    }


    // 新しい休憩データを作成
    const newBreak = {

        name: name,

        time: "時間を設定",

        effect: "自分で追加した休憩"

    };


    // 配列に追加
    breakTypes.unshift(newBreak);


    // 入力欄を空にする
    breakInput.value = "";


    // 一覧を更新
    displayBreakTypes();
};


// ========================================
// 追加ボタン
// ========================================

addButton.addEventListener(
    "click",
    () => {

        addBreak();

    }
);


// ========================================
// Enterキーでも追加
// ========================================

breakInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            addBreak();

        }

    }
);


// ========================================
// 最初に休憩一覧を表示
// ========================================

displayBreakTypes();


// ========================================
// タイマーの状態
// ========================================

let elapsedSeconds = 0;

let timerId = null;

let isRunning = false;

const flowerImg =
    document.querySelector("#flowerImg");


// ========================================
// タイマーHTML要素
// ========================================

const timerDisplay =
    document.querySelector("#timer");

const timerStatus =
    document.querySelector("#timer-status");

const startButton =
    document.querySelector("#startButton");

const pauseButton =
    document.querySelector("#pauseButton");

const resetButton =
    document.querySelector("#resetButton");

let isBreakSelected = false;

startButton.disabled = true;
pauseButton.disabled = true;


// ========================================
// 時間を「00:00」形式にする
// ========================================

const formatTime = (seconds) => {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    const formattedMinutes =
        String(minutes).padStart(2, "0");

    const formattedSeconds =
        String(remainingSeconds).padStart(2, "0");


    return `${formattedMinutes}:${formattedSeconds}`;
};


// ========================================
// タイマー表示を更新
// ========================================

const updateDisplay = () => {

    timerDisplay.textContent =
        formatTime(elapsedSeconds);

};


// ========================================
// タイマー開始
// ========================================

const startTimer = () => {

    // すでに動いていたら何もしない
    if (isRunning) {
        return;
    }


    isRunning = true;

    timerStatus.textContent =
        "休憩中";


    const startTimer = () => {

        // すでに動いていたら何もしない
        if (isRunning) {
            return;
        }


        isRunning = true;

        timerStatus.textContent =
            "休憩中";


        timerId = setInterval(() => {

            elapsedSeconds++;

            updateDisplay();

            change();

        }, 1000);
    };


    timerId = setInterval(() => {

        elapsedSeconds++;

        updateDisplay();

        change();

    }, 1000);
};


// ========================================
// タイマー一時停止
// ========================================

const pauseTimer = () => {

    if (!isRunning) {
        return;
    }


    isRunning = false;

    clearInterval(timerId);


    timerStatus.textContent =
        "休憩一時停止";

};


// ========================================
// スタートボタン
// ========================================

startButton.addEventListener("click", () => {

    // 休憩内容が選択されていなければ何もしない
    if (!isBreakSelected) {
        return;
    }

    startTimer();

});


// ========================================
// 一時停止ボタン
// ========================================

pauseButton.addEventListener("click", () => {

    pauseTimer();

});


// ========================================
// リセット
// ========================================

// リセット

resetButton.addEventListener("click", () => {

    // タイマー停止
    clearInterval(timerId);

    isRunning = false;


    // --------------------------------
    // 時間を0に戻す
    // --------------------------------

    elapsedSeconds = 0;

    updateDisplay();


    // --------------------------------
    // タイマーの状態を初期状態に戻す
    // --------------------------------

    timerStatus.textContent = "休憩開始";




    // --------------------------------
    // 現在の休憩内容を初期状態に戻す
    // --------------------------------

    currentBreakName.textContent =
        "内容を選択してください";


    // 推奨時間も初期状態に戻す
    currentBreakTime.textContent =
        "10～15分";


    // 休憩の効果も初期状態に戻す
    currentBreakEffect.textContent =
        "休憩内容が選択されていません。";


    // --------------------------------
    // 休憩内容の選択状態を解除
    // --------------------------------

    const items =
        document.querySelectorAll(".break-item");

    items.forEach((item) => {

        item.classList.remove("selected");

    });


    isBreakSelected = false;

    startButton.disabled = true;
    pauseButton.disabled = true;


    // --------------------------------
    // イラストを初期状態に戻す
    // --------------------------------

    illustReset();

});


// ========================================
// 花の成長
// ========================================

const change = () => {

    if (elapsedSeconds <= 9) {

        flowerImg.src =
            "images/イラスト土.jpg";

    } else {

        flowerImg.src =
            "images/イラスト芽.jpg";

    }

};


// ========================================
// イラストをリセット
// ========================================

const illustReset = () => {

    flowerImg.src =
        "images/イラスト土.jpg";

};


/* ========================================
   ページ読み込み時のローディング
======================================== */

const loadingScreen =
    document.querySelector("#loadingScreen");

const loadingBar =
    document.querySelector("#loadingBar");

const topVisual =
    document.querySelector("#topVisual");


/*
 * ページが読み込まれたら
 * ローディングを開始
 */

window.addEventListener("load", () => {

    /*
     * ローディングバーが最後まで進む時間
     * 2.2秒に合わせる
     */

    setTimeout(() => {

        // ローディング画面を消す
        loadingScreen.classList.add("loaded");

        // トップ画像を表示
        topVisual.classList.add("show");


    }, 2300);


    /*
     * ローディング終了後に
     * 自動スクロール
     */

    setTimeout(() => {

        const timerArea =
            document.querySelector(".top-layout");

        if (!timerArea) {
            return;
        }


        timerArea.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    }, 3300);

});
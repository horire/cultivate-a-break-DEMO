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

const breakList = document.querySelector("#breakList");
const breakInput = document.querySelector("#breakInput");
const addButton = document.querySelector("#addButton");
const currentBreakName = document.querySelector("#currentBreakName");
const currentBreakTime = document.querySelector("#currentBreakTime");
const currentBreakEffect = document.querySelector("#currentBreakEffect");
const historyList = document.querySelector("#historyList");


// ========================================
// 左側メニュー
// ========================================

const menuToggle = document.querySelector("#menuToggle");
const menuArrow = document.querySelector("#menuArrow");
const breakMenu = document.querySelector("#breakMenu");


// ========================================
// メニューを開閉
// ========================================

const toggleMenu = () => {
    const isOpen = document.body.classList.toggle("menu-open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    breakMenu.setAttribute("aria-hidden", !isOpen);

    if (isOpen) {
        menuArrow.textContent = "←";
        menuToggle.setAttribute("aria-label", "休憩メニューを閉じる");
    } else {
        menuArrow.textContent = "→";
        menuToggle.setAttribute("aria-label", "休憩メニューを開く");
    }
};


// 初期状態はメニューを開く
document.body.classList.add("menu-open");
menuToggle.setAttribute("aria-expanded", "true");
breakMenu.setAttribute("aria-hidden", "false");
menuArrow.textContent = "←";
menuToggle.setAttribute("aria-label", "休憩メニューを閉じる");

menuToggle.addEventListener("click", toggleMenu);


// ========================================
// 今日の休憩履歴
// ========================================

const breakHistory = [];

// 直前の切り替え時のタイマー秒数を記録する変数
let lastSwitchSeconds = 0;


// ========================================
// 休憩一覧を画面に表示
// ========================================

const displayBreakTypes = () => {
    breakList.innerHTML = "";

    breakTypes.forEach((breakType, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.classList.add("break-item");

        item.innerHTML = `
            <div class="break-item-top">
                <span class="break-name">${breakType.name}</span>
                <span class="break-time">推奨 ${breakType.time}</span>
            </div>
            <p class="break-effect">${breakType.effect}</p>
        `;

        item.addEventListener("click", () => {
            selectBreak(index);
        });

        breakList.appendChild(item);
    });
};


// ========================================
// 休憩内容を選択
// ========================================

const selectBreak = (index) => {
    // 1. 直前まで選択されていた休憩要素に対して、選択されていた時間を計算して記録
    if (breakHistory.length > 0) {
        const previousHistory = breakHistory[breakHistory.length - 1];

        // 前回切り替え時からの経過秒数を加算
        const durationSeconds = elapsedSeconds - lastSwitchSeconds;
        previousHistory.durationSeconds = (previousHistory.durationSeconds || 0) + durationSeconds;
        previousHistory.elapsedTime = formatTime(previousHistory.durationSeconds);
    }

    // 切り替え時点のタイマー秒数を保存
    lastSwitchSeconds = elapsedSeconds;

    const selectedBreak = breakTypes[index];

    // 2. 現在の表示項目を更新
    currentBreakName.textContent = selectedBreak.name;
    currentBreakTime.textContent = selectedBreak.time;
    currentBreakEffect.textContent = selectedBreak.effect;

    isBreakSelected = true;
    startButton.disabled = false;
    pauseButton.disabled = false;

    // 3. 選択状態のスタイル切り替え
    const items = document.querySelectorAll(".break-item");
    items.forEach((item) => {
        item.classList.remove("selected");
    });
    items[index].classList.add("selected");

    // 4. 新しい休憩を履歴に追加
    addHistory(selectedBreak);
};


// ========================================
// 履歴を追加
// ========================================

const addHistory = (breakType) => {
    const historyData = {
        name: breakType.name,
        time: breakType.time,
        effect: breakType.effect,
        durationSeconds: 0,
        elapsedTime: formatTime(0)
    };

    breakHistory.push(historyData);
    displayHistory();
};


// ========================================
// 履歴を画面に表示
// ========================================

const displayHistory = () => {
    historyList.innerHTML = "";

    breakHistory.forEach((breakType) => {
        const item = document.createElement("div");
        item.classList.add("history-item");

        item.innerHTML = `
            <span>${breakType.name}</span>
            <span class="history-time">
                ${breakType.elapsedTime ? breakType.elapsedTime : "-"}
            </span>
        `;

        historyList.appendChild(item);
    });
};


// ========================================
// 自由に休憩内容を追加
// ========================================

const addBreak = () => {
    const name = breakInput.value.trim();

    if (name === "") {
        return;
    }

    const newBreak = {
        name: name,
        time: "時間を設定",
        effect: "自分で追加した休憩"
    };

    breakTypes.unshift(newBreak);
    breakInput.value = "";
    displayBreakTypes();
};

addButton.addEventListener("click", addBreak);

breakInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addBreak();
    }
});

displayBreakTypes();


// ========================================
// タイマーの状態
// ========================================

let elapsedSeconds = 0;
let timerId = null;
let isRunning = false;

const flowerImg = document.querySelector("#flowerImg");
const timerDisplay = document.querySelector("#timer");
const timerStatus = document.querySelector("#timer-status");
const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const resetButton = document.querySelector("#resetButton");

let isBreakSelected = false;

startButton.disabled = true;
pauseButton.disabled = true;


// ========================================
// 時間を「00:00」形式にする
// ========================================

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
};


// ========================================
// タイマー表示を更新
// ========================================

const updateDisplay = () => {
    timerDisplay.textContent = formatTime(elapsedSeconds);
};


// ========================================
// タイマー開始
// ========================================

const startTimer = () => {
    if (isRunning) {
        return;
    }

    isRunning = true;
    timerStatus.textContent = "休憩中";

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
    timerStatus.textContent = "休憩一時停止";
};

startButton.addEventListener("click", () => {
    if (!isBreakSelected) {
        return;
    }
    startTimer();
});

pauseButton.addEventListener("click", () => {
    pauseTimer();
});


// ========================================
// 休憩時間の累積変数（1日の振り返り用）
// ========================================

let totalBreakSeconds = 0;


// ========================================
// リセットボタン（タイマー停止 & stat-col書き換え）
// ========================================

resetButton.addEventListener("click", () => {
    // 1. 現在選択されている最後の休憩アイテムについて選択されていた時間を最終確定
    if (breakHistory.length > 0) {
        const currentHistory = breakHistory[breakHistory.length - 1];
        const durationSeconds = elapsedSeconds - lastSwitchSeconds;
        currentHistory.durationSeconds = (currentHistory.durationSeconds || 0) + durationSeconds;
        currentHistory.elapsedTime = formatTime(currentHistory.durationSeconds);
        displayHistory();
    }

    // 2. リセットボタンが押されたタイミングで振り返り用の累計休憩時間（stat-col）を加算・更新
    if (elapsedSeconds > 0) {
        totalBreakSeconds += elapsedSeconds;
    }
    updateBreakTimeDisplay();

    // 3. タイマーおよび各種変数の初期化
    clearInterval(timerId);
    isRunning = false;
    elapsedSeconds = 0;
    lastSwitchSeconds = 0;
    updateDisplay();

    // 4. UI状態の初期化
    timerStatus.textContent = "休憩開始";
    currentBreakName.textContent = "休憩内容を選択してください";
    currentBreakTime.textContent = "〜分";
    currentBreakEffect.textContent = "休憩内容が選択されていません。";

    const items = document.querySelectorAll(".break-item");
    items.forEach((item) => {
        item.classList.remove("selected");
    });

    isBreakSelected = false;
    startButton.disabled = true;
    pauseButton.disabled = true;

    // 5. イラストのリセット
    illustReset();
});


// ========================================
// 花の成長
// ========================================

const change = () => {
    if (elapsedSeconds <= 9) {
        flowerImg.src = "images/イラスト土.jpg";
    } else if (9 < elapsedSeconds && elapsedSeconds <= 12) {
        flowerImg.src = "images/イラスト芽.jpg";
    } else if (12 < elapsedSeconds && elapsedSeconds <= 15) {
        flowerImg.src = "images/イラスト蕾.jpg";
    } else if (15 < elapsedSeconds && elapsedSeconds <= 18) {
        flowerImg.src = "images/イラスト花.jpg";
    }
};

const illustReset = () => {
    flowerImg.src = "images/イラスト土.jpg";
};


/* ========================================
   ページ読み込み時 & トップ領域スクロール
======================================== */

const loadingScreen = document.querySelector("#loadingScreen");
const loadingBar = document.querySelector("#loadingBar");
const topVisual = document.querySelector("#topVisual");

document.body.classList.add("top-active");

window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        document.body.classList.remove("top-active");
    } else {
        document.body.classList.add("top-active");
    }
});

window.addEventListener("load", () => {
    setTimeout(() => {
        loadingScreen.classList.add("loaded");
        topVisual.classList.add("show");
    }, 2300);

    setTimeout(() => {
        const timerArea = document.querySelector(".top-layout");
        if (!timerArea) {
            return;
        }
        timerArea.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 3300);
});


// ========================================
// 1日の振り返り・休憩率の分析機能
// ========================================

const workTimeInput = document.querySelector("#workTimeInput");
const analyzeBtn = document.querySelector("#analyzeBtn");
const displayWorkTime = document.querySelector("#displayWorkTime");
const displayBreakTime = document.querySelector("#displayBreakTime");
const displayBreakRate = document.querySelector("#displayBreakRate");
const feedbackTitle = document.querySelector("#feedbackTitle");
const feedbackText = document.querySelector("#feedbackText");

// 休憩時間 (stat-col) の表示を更新する共通関数
const updateBreakTimeDisplay = () => {
    const breakMins = Math.floor(totalBreakSeconds / 60);
    const breakSecs = totalBreakSeconds % 60;
    displayBreakTime.innerHTML = `${breakMins}<span class="unit">分</span>${breakSecs}<span class="unit">秒</span>`;
};

// 分析ボタン処理
analyzeBtn.addEventListener("click", () => {
    const workMinutes = parseInt(workTimeInput.value, 10);

    if (isNaN(workMinutes) || workMinutes <= 0) {
        alert("作業時間を分単位で入力してください。");
        return;
    }

    if (isRunning) {
        pauseTimer();
    }

    displayWorkTime.textContent = workMinutes;
    updateBreakTimeDisplay();

    const workSeconds = workMinutes * 60;
    const totalTimeSeconds = workSeconds + totalBreakSeconds;

    let breakRate = 0;
    if (totalTimeSeconds > 0) {
        breakRate = (totalBreakSeconds / totalTimeSeconds) * 100;
    }

    displayBreakRate.innerHTML = `${breakRate.toFixed(1)}<span class="unit">%</span>`;

    if (breakRate >= 15 && breakRate <= 25) {
        feedbackTitle.textContent = "とても良いバランスです。";
        feedbackText.textContent = "休憩と作業のバランスが理想的です。この調子で明日も頑張りましょう。";
    } else if (breakRate < 15) {
        feedbackTitle.textContent = "少し休憩が少ないようです。";
        feedbackText.textContent = "根詰めすぎに注意しましょう。適度なリフレッシュが集中力を維持します。";
    } else {
        feedbackTitle.textContent = "しっかりリフレッシュできました。";
        feedbackText.textContent = "十分な休憩が取れています。メリハリをつけて次の作業に向かいましょう。";
    }

    totalBreakSeconds = 0;
    workTimeInput.value = "";
});

// ========================================
// モバイル版のナビゲーション & スクロール機能
// ========================================

const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
const menuOverlay = document.querySelector("#menuOverlay");
const scrollToTimerBtn = document.querySelector("#scrollToTimerBtn");
const scrollToBottomBtn = document.querySelector("#scrollToBottomBtn");

// 1. 左下アイコンクリックで breakMenu を開閉
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        document.body.classList.toggle("menu-open");
    });
}

// オーバーレイをクリックでメニューを閉じる
if (menuOverlay) {
    menuOverlay.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
    });
}

// 2. 真ん中アイコンクリックで timer-circle へスクロール
if (scrollToTimerBtn) {
    scrollToTimerBtn.addEventListener("click", () => {
        const timerCircle = document.querySelector(".timer-circle") || document.querySelector("#timer");
        if (timerCircle) {
            timerCircle.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
}

// 3. 右アイコンクリックで一番下までスクロール
if (scrollToBottomBtn) {
    scrollToBottomBtn.addEventListener("click", () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
        });
    });
}
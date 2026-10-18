
// ========================================
// 休憩内容のデータ
// ========================================

const breakTypes = [
    {
        name: "散歩",
        time: "10～15分",
        effect: "眠気や疲労感の軽減、注意力・集中力の回復"
    },
    {
        name: "ストレッチ",
        time: "10～15分",
        effect: "身体の凝り・血流改善、疲労感の軽減"
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
    },
    {
        name: "仮眠",
        time: "10分～20分",
        effect: "集中力の回復、記憶力学習効率の向上"
    },
    {
        name: "顔を洗う",
        time: "2分～3分",
        effect: "気分転換、覚醒感の向上"
    },
    {
        name: "部屋の片付け",
        time: "5分～10分",
        effect: "作業環境の改善、次の作業に取り組みやすくなる"
    },
    {
        name: "窓の外を眺める",
        time: "2分～3分",
        effect: "目の疲れの軽減、注意力の回復"
    },
    {
        name: "雑談",
        time: "5分～10分",
        effect: "活力の向上、孤立感の軽減、ストレス軽減"
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
    // 直前まで選択されていた休憩の時間を計算して記録
    if (breakHistory.length > 0) {
        const previousHistory = breakHistory[breakHistory.length - 1];

        const durationSeconds = elapsedSeconds - lastSwitchSeconds;
        previousHistory.durationSeconds =
            (previousHistory.durationSeconds || 0) + durationSeconds;

        previousHistory.elapsedTime =
            formatTime(previousHistory.durationSeconds);
    }

    // 切り替え時点のタイマー秒数を保存
    lastSwitchSeconds = elapsedSeconds;

    const selectedBreak = breakTypes[index];

    // 現在の表示項目を更新
    currentBreakName.textContent = selectedBreak.name;
    currentBreakTime.textContent = selectedBreak.time;
    currentBreakEffect.textContent = selectedBreak.effect;

    isBreakSelected = true;
    startButton.disabled = false;
    pauseButton.disabled = false;

    // 選択状態のスタイルを切り替え
    const items = document.querySelectorAll(".break-item");

    items.forEach((item) => {
        item.classList.remove("selected");
    });

    items[index].classList.add("selected");

    // 新しい休憩を履歴に追加
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

// 休憩内容が選択されるまでは操作できないようにする
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

let totalBreakSeconds =
    Number(localStorage.getItem("cultivateBreakTotalSeconds")) || 0;


// ========================================
// 振り返りページに休憩時間を保存
// ========================================

const saveReflectionData = () => {
    localStorage.setItem(
        "cultivateBreakTotalSeconds",
        String(totalBreakSeconds)
    );
};


// ========================================
// リセットボタン
// 休憩時間を保存して振り返りページを開く
// ========================================

resetButton.addEventListener("click", () => {

    // 現在の休憩を履歴に反映
    if (breakHistory.length > 0) {
        const currentHistory = breakHistory[breakHistory.length - 1];

        const durationSeconds = elapsedSeconds - lastSwitchSeconds;

        currentHistory.durationSeconds =
            (currentHistory.durationSeconds || 0) + durationSeconds;

        currentHistory.elapsedTime =
            formatTime(currentHistory.durationSeconds);

        displayHistory();
    }

    // 保存済みの累計休憩時間を取得
    const savedSeconds =
        Number(localStorage.getItem("cultivateBreakTotalSeconds")) || 0;

    // リセット前に今回の経過時間を累計に加算
    totalBreakSeconds = savedSeconds + elapsedSeconds;

    // 累計休憩時間を保存
    saveReflectionData();

    // URLにも秒数を渡し、別タブで確実に表示できるようにする
    const reflectionUrl =
        `reflection.html?breakSeconds=${encodeURIComponent(totalBreakSeconds)}`;

    // 振り返りページを1回だけ別タブで開く
    window.open(reflectionUrl, "_blank");

    // タイマーを停止
    clearInterval(timerId);
    isRunning = false;

    // タイマー表示を初期化
    elapsedSeconds = 0;
    lastSwitchSeconds = 0;
    updateDisplay();

    // 休憩内容の表示を初期状態に戻す
    timerStatus.textContent = "休憩開始";
    currentBreakName.textContent = "休憩内容を選択してください";
    currentBreakTime.textContent = "〜分";
    currentBreakEffect.textContent = "休憩内容が選択されていません。";

    // 休憩項目の選択状態を解除
    document.querySelectorAll(".break-item").forEach((item) => {
        item.classList.remove("selected");
    });

    isBreakSelected = false;
    startButton.disabled = true;
    pauseButton.disabled = true;

    // 花のイラストを初期状態に戻す
    illustReset();
});


// ========================================
// 花の成長
// ========================================

const change = () => {
    if (elapsedSeconds <= 9) {
        flowerImg.src = "images/イラスト土.jpg";
    } else if (elapsedSeconds <= 12) {
        flowerImg.src = "images/イラスト芽.jpg";
    } else if (elapsedSeconds <= 15) {
        flowerImg.src = "images/イラスト蕾.jpg";
    } else if (elapsedSeconds <= 18) {
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
// モバイル版のナビゲーション & スクロール機能
// ========================================

const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
const menuOverlay = document.querySelector("#menuOverlay");
const scrollToTimerBtn = document.querySelector("#scrollToTimerBtn");
const scrollToBottomBtn = document.querySelector("#scrollToBottomBtn");

// 左下アイコンで休憩メニューを開閉
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        document.body.classList.toggle("menu-open");
    });
}

// オーバーレイをクリックするとメニューを閉じる
if (menuOverlay) {
    menuOverlay.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
    });
}

// 真ん中アイコンでタイマーまでスクロール
if (scrollToTimerBtn) {
    scrollToTimerBtn.addEventListener("click", () => {
        const timerCircle =
            document.querySelector(".timer-circle") ||
            document.querySelector("#timer");

        if (timerCircle) {
            timerCircle.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
}

// 右アイコンでページ最下部までスクロール
if (scrollToBottomBtn) {
    scrollToBottomBtn.addEventListener("click", () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
        });
    });
}

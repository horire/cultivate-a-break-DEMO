
 // ========================================
 // 1日の振り返り・休憩率の分析
 // ========================================

 // HTML要素を取得
 const workTimeInput = document.querySelector("#workTimeInput");
 const analyzeBtn = document.querySelector("#analyzeBtn");

 const displayWorkTime = document.querySelector("#displayWorkTime");
 const displayBreakTime = document.querySelector("#displayBreakTime");
 const displayBreakRate = document.querySelector("#displayBreakRate");

 const feedbackTitle = document.querySelector("#feedbackTitle");
 const feedbackText = document.querySelector("#feedbackText");


 // ========================================
 // 保存された累計休憩時間を取得
 // 単位：秒
 // ========================================

 // URLから渡された休憩時間を優先し、なければlocalStorageから取得
 const reflectionParams = new URLSearchParams(window.location.search);
 const breakSecondsParam = reflectionParams.get("breakSeconds");

 let totalBreakSeconds;

 if (
     breakSecondsParam !== null &&
     breakSecondsParam.trim() !== "" &&
     Number.isFinite(Number(breakSecondsParam)) &&
     Number(breakSecondsParam) >= 0
 ) {
     totalBreakSeconds = Number(breakSecondsParam);

     // 別タブでURLから受け取った値を保存しておく
     localStorage.setItem(
         "cultivateBreakTotalSeconds",
         String(totalBreakSeconds)
     );

     // URLのパラメータを取り除く
     window.history.replaceState(
         null,
         document.title,
         window.location.pathname + window.location.hash
     );
 } else {
     totalBreakSeconds =
         Number(localStorage.getItem("cultivateBreakTotalSeconds")) || 0;
 }


 // ========================================
 // 休憩時間を画面に表示
 // ========================================

 // 秒数をタイマーと同じ「分:秒」形式に変換
 const formatBreakTime = (seconds) => {
     const minutes = Math.floor(seconds / 60);
     const remainingSeconds = seconds % 60;

     return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
 };

 // 休憩時間を画面に反映
 const updateBreakTimeDisplay = () => {
     displayBreakTime.textContent = formatBreakTime(totalBreakSeconds);
 };

 // ページを開いた時点で休憩時間を表示
 updateBreakTimeDisplay();


 // 別タブで休憩時間が更新されたとき、表示も更新
 window.addEventListener("storage", (event) => {
     if (event.key === "cultivateBreakTotalSeconds") {
         totalBreakSeconds = Number(event.newValue) || 0;
         updateBreakTimeDisplay();
     }
 });


 // ========================================
 // 分析ボタン
 // ========================================

 analyzeBtn.addEventListener("click", () => {

     // 入力された作業時間を取得
     const workMinutes = Number(workTimeInput.value);

     // 入力チェック
     if (
         workTimeInput.value.trim() === "" ||
         !Number.isFinite(workMinutes) ||
         workMinutes <= 0
     ) {
         alert("作業時間を1分以上で入力してください。");
         return;
     }

     // 作業時間を表示
     displayWorkTime.textContent = workMinutes;

     // 休憩時間を再表示
     updateBreakTimeDisplay();


     // ========================================
     // 休憩率を計算
     // 休憩時間 ÷（作業時間＋休憩時間）× 100
     // ========================================

     const workSeconds = workMinutes * 60;
     const totalTimeSeconds = workSeconds + totalBreakSeconds;

     const breakRate = totalTimeSeconds > 0
         ? (totalBreakSeconds / totalTimeSeconds) * 100
         : 0;

     // 休憩率を小数点第1位まで表示
     displayBreakRate.innerHTML =
         `${breakRate.toFixed(1)}<span class="unit">%</span>`;


     // ========================================
     // 分析結果に応じたメッセージを表示
     // ========================================

     if (breakRate >= 15 && breakRate <= 25) {

         feedbackTitle.textContent = "とても良いバランスです。";

         feedbackText.textContent =
             "休憩と作業のバランスが理想的です。" +
             "この調子で明日も頑張りましょう。";

     } else if (breakRate < 15) {

         feedbackTitle.textContent = "少し休憩が少ないようです。";

         feedbackText.textContent =
             "根詰めすぎに注意しましょう。" +
             "適度なリフレッシュが集中力を維持します。";

     } else {

         feedbackTitle.textContent = "しっかりリフレッシュできました。";

         feedbackText.textContent =
             "十分な休憩が取れています。" +
             "メリハリをつけて次の作業に向かいましょう。";
     }


     // ========================================
     // 分析後は累計休憩時間をリセット
     // ========================================

     totalBreakSeconds = 0;

     localStorage.setItem("cultivateBreakTotalSeconds", "0");

     // 次回に備えて表示も0にする
     updateBreakTimeDisplay();

     // 入力欄を空にする
     workTimeInput.value = "";
 });

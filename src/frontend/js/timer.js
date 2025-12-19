 //UI層は COに★ 将来的に分割する可能性あり

// Web Notifications APIの許可リクエスト
Notification.requestPermission().then(permission => {
  console.log("通知許可:", permission);
});

// ポモドーロ回数を管理 初期値は0
let pomodoroCount = 0;

// セッションタイプと時間（分）をまとめて管理 （テスト用に短縮）
const sessionDurations = {
  work: 2,        // 作業時間 25分
  shortBreak: 1,  // 短い休憩 5分
  longBreak: 3,    // 長い休憩 15分
  longBreakFrequency: 3 // 長い休憩の頻度 とりあえず3回ごと
};

let seconds = sessionDurations.work * 60; // 作業時間を初期値に設定
let currentSession = "work"; // "work" / "shortBreak" / "longBreak" workを初期値に設定
let timerId = null; //setInterval()が返すIDを格納する変数。初期値はタイマーが動いていないことを示すnull

//ローカルサーバーに保存されたJSON文字列を取得
const savedSettings = JSON.parse(localStorage.getItem("pomodoroSettings"));
// const savedSettings = localStorage.getItem("pomodoroSettings"); いらない説
if (savedSettings) {
  //保存された設定があれば、sessionDurationsオブジェクトを上書き
  //pareseIntでJSON文字列を整数に変換、第二引数は基数10進数を意味する
  // const parsed = JSON.parse(savedSettings); オブジェクトに変換するための変数だけど使ってないからいらない説

  sessionDurations.work = parseInt(savedSettings.workDuration, 10);
  sessionDurations.shortBreak = parseInt(savedSettings.shortBreak, 10);
  sessionDurations.longBreak = parseInt(savedSettings.longBreak, 10);
  sessionDurations.longBreakFrequency = parseInt(savedSettings.longBreakFrequency, 10);
  console.log("保存された設定を読み込みました:", sessionDurations);
} else {
  console.log("保存された設定はありません。デフォルト設定を使用します。", sessionDurations);
}

//初期表示時間を"work"セッションに合わせて表示する // ★
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

document.getElementById("timer-container").textContent =
  formatTime(sessionDurations[currentSession] * 60); // ★



// カウントダウン処理
function countDown() {
  seconds--;
  if (seconds >= 0) {
    updateTimerUI(seconds); // ★
  } else {
    clearInterval(timerId);
    timerId = null;
    updateControlBtn(false); // ★
    console.log("タイマー終了！");

    // 通知
    if (Notification.permission === "granted") {
      new Notification("⏰ タイマー終了！");
    }

    // セッション管理
    if (currentSession === "work") {
      pomodoroCount++;

      updatePomodoroCountUI();

      if (pomodoroCount % 3 === 0) {
        currentSession = "longBreak";
        console.log("長い休憩へ移行");
        
      } else {
        currentSession = "shortBreak";
        console.log("短い休憩へ移行");
        
      }
      console.log("ポモドーロ回数:", pomodoroCount);
    } else {
      currentSession = "work";
      console.log("作業へ戻る");
      console.log("ポモドーロ回数:", pomodoroCount);
      
    }
  }
}

// セッション開始処理（新規開始時のみ秒数をリセット）
function startSession() {
  if (currentSession === "work") {
    seconds = sessionDurations.work * 60;
    console.log("作業開始");
    document.getElementById("session-status").textContent = "💼 作業中"; // ★
  } else if (currentSession === "shortBreak") {
    seconds = sessionDurations.shortBreak * 60;
    console.log("短い休憩開始");
    document.getElementById("session-status").textContent = "☕ 休憩中"; // ★
  } else if (currentSession === "longBreak") {
    seconds = sessionDurations.longBreak * 60;
    console.log("長い休憩開始");
    document.getElementById("session-status").textContent = "🌿 長めの休憩中"; // ★
  }
  updateTimerUI(seconds); // ★
  timerId = setInterval(countDown, 1000);
  updateControlBtn(true); // ★
}

// 残り時間を表示する関数
function updateTimerUI(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  document.getElementById("timer-container").textContent = formatted; // ★
  console.log("残り時間:", formatted);
}

// コントロールボタンの表示更新 // ★
function updateControlBtn(isRunning) {
  document.getElementById("control-btn").textContent = isRunning ? "⏸" : "▶";
}

// ポモドーロ回数表示更新 // ★
function updatePomodoroCountUI() {
  document.getElementById("pomodoro-count").textContent =
    `現在 ${pomodoroCount} ポモドーロ完了！`;
}


//コントロールタイマーイベント
let hasStarted = false; // 初期状態は「まだ開始していない」

document.getElementById("control-btn").addEventListener("click", () => {
  if (!timerId) {
    if (!hasStarted || seconds <= 0) {
      // 新しいセッション開始
      startSession();
      hasStarted = true;
    } else {
      // 停止後の再開（残り時間から続行）
      console.log("タイマー再開");
      timerId = setInterval(countDown, 1000);
      updateControlBtn(true);
    }
  } else {
    //停止処理
    console.log("タイマー停止");
    clearInterval(timerId);
    timerId = null;
    updateControlBtn(false);
  }
});
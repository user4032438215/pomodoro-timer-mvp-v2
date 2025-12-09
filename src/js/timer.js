// ---------------- ロジック層 ----------------

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
  longBreak: 3    // 長い休憩 15分
};

let seconds = sessionDurations.work * 60; // 作業時間を初期値に設定
let currentSession = "work"; // "work" / "shortBreak" / "longBreak" workを初期値に設定
let timerId = null; //setInterval()が返すIDを格納する変数。初期値はタイマーが動いていないことを示すnull


// カウントダウン処理
function countDown() {
  seconds--;
  if (seconds >= 0) {
    updateTimerUI(seconds); // ★ UI層呼び出し
  } else {
    clearInterval(timerId);
    timerId = null;
    updateControlBtn(false); // ★ UI層呼び出し
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
  } else if (currentSession === "shortBreak") {
    seconds = sessionDurations.shortBreak * 60;
    console.log("短い休憩開始");
  } else if (currentSession === "longBreak") {
    seconds = sessionDurations.longBreak * 60;
    console.log("長い休憩開始");
  }
  updateTimerUI(seconds); // ★ UI層呼び出し
  timerId = setInterval(countDown, 1000);
  updateControlBtn(true); // ★ UI層呼び出し
}

// ---------------- UI層 ----------------

// 残り時間を表示する関数
function updateTimerUI(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  document.getElementById("timer-container").textContent = formatted;
  console.log("残り時間:", formatted);
}

// コントロールボタンの表示更新
function updateControlBtn(isRunning) {
  document.getElementById("control-btn").textContent = isRunning ? "⏸" : "▶";
}

function updatePomodoroCountUI() {
  document.getElementById("pomodoro-count").textContent =
    `現在 ${pomodoroCount} ポモドーロ完了！`;
}

// ---------------- イベント層 ----------------

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
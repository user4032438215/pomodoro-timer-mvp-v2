//ロジック層（タイマー計算、状態管理）とUI更新処理、将来的に分割する予定、UI層には★

//Web Notifications APIの許可のリクエスト
Notification.requestPermission().then(permission => {
  console.log("通知許可:", permission);
  // "granted"=ユーザーが許可した場合 / "denied"=ユーザーが通知を拒否した場合 / "default"= ユーザーがまだ「許可／拒否」を選んでいない状態。
});

// ポモドーロ回数を管理
let pomodoroCount = 0;

// セッション時間（分）をまとめて管理
const sessionDurations = {
  work: 2,       // 作業時間
  shortBreak: 1,  // 短い休憩
  longBreak: 3   // 長い休憩
};

let seconds = sessionDurations.work * 60; // 秒に変換
let timerId = null;



// 残り時間を表示する関数
function showTime() {
  const minutes = Math.floor(seconds / 60); //残り時間（秒）を「分」に変換している。
  const secs = seconds % 60; //残り秒数の「余り」を計算している。つまり「分にできなかった残り秒」を取得

  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`; //分と秒を「00:00」の形に整えている。
  //String() → 数字を文字に変換。.padStart()を使うために文字列に変換する必要がある。
  //.padStart(2, "0") → 2桁になるように前に「0」を足す。mm:ss形式にするため

  document.getElementById("timer-container").textContent = formatted; //★
  console.log("残り時間:", formatted); // コンソールにも表示
}

// カウントダウン処理
function countDown() {
  seconds--;
  if (seconds >= 0) {
    showTime();
  } else {
    clearInterval(timerId);
    timerId = null;
    document.getElementById("control-btn").textContent = "▶"; // 終了時にリセット ★
    console.log("タイマー終了！");

    //Web Notifications APIで通知 ★? 将来的に OK / Later ボタン を実装予定。
    if (Notification.permission === "granted") {
      new Notification("⏰ タイマー終了！");
    } 


    // 作業セッションが終わった場合 → ポモドーロ回数を増やす
    if (currentSession === "work") {
      pomodoroCount++;

      // 休憩の種類を判定
      if (pomodoroCount % 3 === 0) {
        currentSession = "longBreak";
        console.log("長い休憩へ移行");
        console.log("ポモドーロ回数:", pomodoroCount);
      } else {
        currentSession = "shortBreak";
        console.log("短い休憩へ移行");
        console.log("ポモドーロ回数:", pomodoroCount);
      }
    } else {
      // 休憩が終わったら次は作業
      currentSession = "work";
      console.log("作業へ戻る");
      console.log("ポモドーロ回数:", pomodoroCount);
    }
  }
}

// 休憩開始関数
function startBreak(durationMinutes) {
  seconds = durationMinutes * 60;
  showTime();
  timerId = setInterval(countDown, 1000);
}

// セッション状態を管理
let currentSession = "work"; // "work" / "shortBreak" / "longBreak"


// タイマートグル
document.getElementById("control-btn").addEventListener("click", () => {
  if (!timerId) {
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

    showTime(); // 初期表示
    timerId = setInterval(countDown, 1000);
    document.getElementById("control-btn").textContent = "⏸"; // 停止アイコンに変更 ★
  } else {
    console.log("タイマー停止");
    clearInterval(timerId);
    timerId = null;
    document.getElementById("control-btn").textContent = "▶"; // 再生アイコンに戻す ★
  }
});

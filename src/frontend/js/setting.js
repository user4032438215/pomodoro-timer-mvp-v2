//①要素の値を取得して変数に代入
// const workDuration = document.getElementById("work-duration-input").value;

//②ローカルストレージにキー"workDuration"と値、実際に入力フォームに入力された値を保存
// localStorage.setItem("workDuration", workDuration); 
//ただしこの処理の記述が4回も必要。さすがに冗長なので、オブジェクトにまとめてJSON文字列としてローカルストレージに上書き保存する
//↓
// document.getElementById("save-settings").addEventListener("click", () => {
//   const settings = {
//     workDuration: document.getElementById("work-duration-input").value,
//     shortBreak: document.getElementById("break-duration-input").value,
//     longBreak: document.getElementById("long-break-duration-input").value,
//     longBreakFrequency: document.getElementById("long-break-frequency-input").value
//   };
//   localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
//   console.log("保存しました:", settings);
//   alert("設定を保存しました！"); //★
// });

//UI更新と保存処理が混ざってるけど、まあいいか。
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settings-form");

  // --- UI更新処理: ページロード時に保存済み設定をフォームへ反映 ---
  const savedSettings = JSON.parse(localStorage.getItem("pomodoroSettings"));
  if (savedSettings) {
    document.getElementById("work-duration-input").value = savedSettings.workDuration;
    document.getElementById("break-duration-input").value = savedSettings.shortBreak;
    document.getElementById("long-break-duration-input").value = savedSettings.longBreak;
    document.getElementById("long-break-frequency-input").value = savedSettings.longBreakFrequency;
    console.log("フォームに保存済み設定を反映しました:", savedSettings);
  } else {
    console.log("保存済み設定はありません。デフォルト値を使用します。");
  }

  // --- 保存処理: フォーム送信時にlocalStorageへ保存 ---
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // ページリロード防止

    const settings = {
      workDuration: document.getElementById("work-duration-input").value,
      shortBreak: document.getElementById("break-duration-input").value,
      longBreak: document.getElementById("long-break-duration-input").value,
      longBreakFrequency: document.getElementById("long-break-frequency-input").value
    };

    //バリデーション（必須入力 → 範囲チェック → 整合性チェック の順序）
    // 必須チェック
    if (!settings.workDuration || !settings.shortBreak || !settings.longBreak || !settings.longBreakFrequency) {
      alert("全ての項目を入力してください");
      return;
    }

    // 範囲チェック
    if (settings.workDuration < 1 || settings.workDuration > 60) {
      alert("作業時間は1〜60分の範囲で入力してください");
      return;
    }
    if (settings.shortBreak < 1 || settings.shortBreak > 60) {
      alert("休憩時間は1〜60分の範囲で入力してください");
      return;
    }
    if (settings.longBreak < 1 || settings.longBreak > 60) {
      alert("長休憩時間は1〜60分の範囲で入力してください");
      return;
    }
    if (settings.longBreakFrequency < 1 || settings.longBreakFrequency > 60) {
      alert("長休憩の頻度は1〜60の範囲で入力してください");
      return;
    }




    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    console.log("保存しました:", settings);
  });
});

//①要素の値を取得して変数に代入
// const workDuration = document.getElementById("work-duration-input").value;

//②ローカルストレージにキー"workDuration"と値、実際に入力フォームに入力された値を保存
// localStorage.setItem("workDuration", workDuration); 
//ただしこの処理の記述が4回も必要。さすがに冗長なので、オブジェクトにまとめてJSON文字列としてローカルストレージに上書き保存する


document.getElementById("save-settings").addEventListener("click", () => {
  const settings = {
    workDuration: document.getElementById("work-duration-input").value,
    shortBreak: document.getElementById("break-duration-input").value,
    longBreak: document.getElementById("long-break-duration-input").value,
    longBreakFrequency: document.getElementById("long-break-frequency-input").value
  };
  localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
  console.log("保存しました:", settings);
  alert("設定を保存しました！"); //★
});


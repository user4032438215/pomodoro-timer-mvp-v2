//フォームの値が空白かどうかをチェックするユーティリティ関数
function isBlank(value) {
  return !value || value.trim() === "";
}

//エラーメッセージを表示・非表示にするユーティリティ関数
function showError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = "⚠️ " + message;
    el.style.display = "block";
  }
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "none";
  }
}
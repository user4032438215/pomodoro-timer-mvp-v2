// frontend/js/login.js

const form = document.querySelector("form");
const resultDiv = document.querySelector("#result");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailValue = document.querySelector("input[name='email']").value;
  const passwordValue = document.querySelector("input[name='password']").value;

  const url = "http://localhost:3000/login";

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailValue,
      password: passwordValue
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("ログイン結果:", data);

      if (data.ok === false) {
        resultDiv.innerText = "ログイン失敗: " + data.error;
        return;
      }

      resultDiv.innerText = "ログイン成功";
    })
    .catch(err => {
      console.error("通信エラー:", err);
      resultDiv.innerText = "通信エラーが発生しました";
    });
});
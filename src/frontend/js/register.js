// frontend/js/register.js

const form = document.querySelector("form");
const resultDiv = document.querySelector("#result");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // ページリロード防止

  const emailValue = document.querySelector("input[name='email']").value;
  const passwordValue = document.querySelector("input[name='password']").value;

  const url = "http://localhost:3000/register";

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
      console.log("サーバーからの返事:", data);

      if (data.ok === false) {
        resultDiv.innerText = "エラー: " + data.error;
        return;
      }

      resultDiv.innerText = "登録が完了しました";
    })
    .catch(err => {
      console.error("通信エラー:", err);
      resultDiv.innerText = "通信エラーが発生しました";
    });
});
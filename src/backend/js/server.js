// server.js

const express = require("express");
const app = express();

const cors = require("cors");

// DB接続チェック
const pool = require("./db");
pool.query("SELECT NOW()")
  .then(result => console.log("DB接続OK:", result.rows[0]))
  .catch(err => console.error("DB接続エラー:", err));

// ミドルウェアの設定
app.use(express.json());
app.use(cors());


// ルート読み込み
const registerRoute = require("./register");
const loginRoute = require("./login");
const updateRoute = require("./updateUser");
const deleteRoute = require("./deleteUser");

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/update", updateRoute);
app.use("/delete", deleteRoute);

// 静的ファイルは最後に 
app.use(express.static("public"));

//PS C:\Users\sigon\Downloads\download_backup\pomodoro-timer-mvp-v2> node src/backend/js/server.js
// 『Ctrl+C』でサーバーを停止
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});

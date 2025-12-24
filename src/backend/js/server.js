//Express等のエントリーポイント
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());



// ルート読み込み
const registerRoute = require("./register");
const loginRoute = require("./login");

app.use("/register", registerRoute);
app.use("/login", loginRoute);



// node server.js というコマンドでサーバーを起動。『Ctrl+C』でサーバーを停止
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});

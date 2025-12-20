//PostgreSQL接続設定（pgライブラリ）

require("dotenv").config(); //.envファイルを読み込む

const express = require("express");
const app = express(); // Expressフレームワークを読み込んでアプリケーションを作成

const cors = require("cors"); // CORSを許可するためのライブラリを読み込む

const { Pool } = require("pg"); // PostgreSQL用ライブラリを読み込む

//.envファイル+.gitignoreで管理
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;

const PORT = 3000;

app.listen(PORT, () => console.log("✅ 起動: http://localhost:" + PORT)); //サーバー起動テストOK node db.js


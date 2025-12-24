//PostgreSQL接続設定（pgライブラリ）

//.envファイルを読み込む
require("dotenv").config(); 

//-- server.jsに置くべきコード
// // Expressフレームワークを読み込んでアプリケーションを作成
// const express = require("express");
// const app = express(); 

// // CORSを許可するためのライブラリを読み込む
// const cors = require("cors"); 
//-- 

// PostgreSQL用ライブラリを読み込む
const { Pool } = require("pg"); 

//.envファイル+.gitignoreで管理
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
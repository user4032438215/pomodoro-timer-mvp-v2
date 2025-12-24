//backend/js/register.js

const express = require("express");

//register に関する処理だけを担当する小さなサーバーサーバーを作る
const router = express.Router();

//db.jsへのパイプライン
const pool = require("./db");

// Create（新規ユーザー登録）
router.post("/", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ ok: false, error: "すべてのフォームを入力してください" });
  }

  const sql = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";

  pool.query(sql, [username, email, password])
    .then(result => {
      res.json({ ok: true, user: result.rows[0] });
    })
    .catch(err => {
      console.error("登録エラー:", err);
      res.status(500).json({ ok: false, error: "DBエラーが発生しました" });
    });
});

//server.js へのパイプライン
module.exports = router;  
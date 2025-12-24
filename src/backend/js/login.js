//backend/js/login.js

const express = require("express");

// login に関する処理だけを担当する小さなサーバーサーバーを作る
const router = express.Router();

//db.jsへのパイプライン
const pool = require("./db");

// Read（ログインチェック）
router.post("/", (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "メールとパスワードは必須です" });
  }

  const sql = "SELECT * FROM users WHERE email = $1 AND password = $2";

  pool.query(sql, [email, password])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(401).json({ ok: false, error: "メールまたはパスワードが違います" });
      }

      res.json({ ok: true, user: result.rows[0] });
    })
    .catch(err => {
      console.error("ログインエラー:", err);
      res.status(500).json({ ok: false, error: "DBエラーが発生しました" });
    });
});

//server.js へのパイプライン
module.exports = router;
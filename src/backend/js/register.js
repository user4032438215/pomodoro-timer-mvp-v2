const express = require("express");
const router = express.Router();   // ← 「 /register に関する処理だけを担当する小さなサーバーサーバー」を作る
const pool = require("./db");      // ← db.jsへのパイプライン

// Create（新規ユーザー登録）
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // サーバー側の簡易チェック
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "メールとパスワードは必須です" });
  }

  const sql = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";

  pool.query(sql, [email, password])
    .then(result => {
      res.json({ ok: true, user: result.rows[0] });
    })
    .catch(err => {
      console.error("登録エラー:", err);
      res.status(500).json({ ok: false, error: "DBエラーが発生しました" });
    });
});



module.exports = router;  // ← server.js へのパイプライン
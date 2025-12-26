// backend/js/updateUser.js

const express = require("express");

// login に関する処理だけを担当する小さなサーバーサーバーを作る
const router = express.Router();

//db.jsへのパイプライン
const pool = require("./db");

// Update（ユーザー情報更新）
router.put("/", (req, res) => {
  const { id, username, email, password } = req.body;

  // TODO: 認可チェック（本人 or admin のみ許可）

  if (!id) {
    return res.status(400).json({ ok: false, error: "ユーザーIDが必要です" });
  }

  // 更新する項目を動的に組み立てる
  const fields = [];
  const values = [];
  let index = 1;

  if (username) {
    fields.push(`username = $${index++}`);
    values.push(username);
  }
  if (email) {
    fields.push(`email = $${index++}`);
    values.push(email);
  }
  if (password) {
    fields.push(`password = $${index++}`);
    values.push(password);
  }

  if (fields.length === 0) {
    return res.status(400).json({ ok: false, error: "更新項目がありません" });
  }

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
  values.push(id);

  pool.query(sql, values)
    .then(result => {
      res.json({ ok: true, user: result.rows[0] });
    })
    .catch(err => {
      console.error("更新エラー:", err);
      res.status(500).json({ ok: false, error: "DBエラーが発生しました" });
    });
});

//server.js へのパイプライン
module.exports = router;

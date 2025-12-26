// backend/js/deleteUser.js

const express = require("express");

// login に関する処理だけを担当する小さなサーバーサーバーを作る
const router = express.Router();

//db.jsへのパイプライン
const pool = require("./db");

// Delete（ユーザー削除）
router.delete("/", (req, res) => {
  const { id } = req.body;

  // TODO: 認可チェック（本人 or admin のみ許可）

  if (!id) {
    return res.status(400).json({ ok: false, error: "ユーザーIDが必要です" });
  }

  const sql = "DELETE FROM users WHERE id = $1 RETURNING *";

  pool.query(sql, [id])
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ ok: false, error: "ユーザーが見つかりません" });
      }
      res.json({ ok: true, deletedUser: result.rows[0] });
    })
    .catch(err => {
      console.error("削除エラー:", err);
      res.status(500).json({ ok: false, error: "DBエラーが発生しました" });
    });
});

//server.js へのパイプライン
module.exports = router;

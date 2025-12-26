// backend/js/integration.test.js

//node src/backend/js/integration.test.js

// const fetch = require("node-fetch"); // Node v22 では不要
const pool = require("./db");

// テスト用ユーザー（既存のダミーデータを使用）
const testEmail = "alice@example.com";
const testPassword = "alice123";

// update/delete テスト用に登録したユーザーのIDを保持
let createdUserId = null;

// 1. DB接続テスト
function testDB() {
  console.log("=== 🧪 DB接続テスト ===");

  return pool.query("SELECT NOW()")
    .then(result => {
      console.log("✅ DB接続成功:", result.rows[0]);
    })
    .catch(err => {
      console.error("❌ DB接続エラー:", err);
    });
}

// 2. サーバー起動テスト
function testServer() {
  console.log("\n=== 🧪 サーバー起動テスト ===");

  return fetch("http://localhost:3000")
    .then(() => {
      console.log("✅ サーバー起動確認: OK");
    })
    .catch(err => {
      console.error("❌ サーバーに接続できません:", err);
    });
}

// 3. /register API テスト（新規ユーザー登録）
function testRegister() {
  console.log("\n=== 🧪 /register APIテスト ===");

  const newUsername = "new_user_" + Date.now();
  const newEmail = "new_user_" + Date.now() + "@example.com";
  const newPassword = "testpass123";

  return fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: newUsername,
      email: newEmail,
      password: newPassword
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("📡 /register の返答:", data);

      if (data.ok && data.user) {
        createdUserId = data.user.id; // update/delete 用に保存
        console.log("🆔 作成されたユーザーID:", createdUserId);
      }
    })
    .catch(err => {
      console.error("❌ /register テスト中にエラー:", err);
    });
}

// 4. /login API テスト（既存ユーザーでログイン）
function testLogin() {
  console.log("\n=== 🧪 /login APIテスト ===");

  return fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("📡 /login の返答:", data);
    })
    .catch(err => {
      console.error("❌ /login テスト中にエラー:", err);
    });
}

// 5. /update API テスト（ユーザー情報更新）
function testUpdateUser() {
  console.log("\n=== 🧪 /update APIテスト ===");

  if (!createdUserId) {
    console.log("⚠ 更新テストをスキップ: createdUserId がありません");
    return Promise.resolve();
  }

  return fetch("http://localhost:3000/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: createdUserId,
      username: "updated_user_" + Date.now()
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("📡 /update の返答:", data);
    })
    .catch(err => {
      console.error("❌ /update テスト中にエラー:", err);
    });
}

// 6. /delete API テスト（ユーザー削除）
function testDeleteUser() {
  console.log("\n=== 🧪 /delete APIテスト ===");

  if (!createdUserId) {
    console.log("⚠ 削除テストをスキップ: createdUserId がありません");
    return Promise.resolve();
  }

  return fetch("http://localhost:3000/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: createdUserId
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("📡 /delete の返答:", data);
    })
    .catch(err => {
      console.error("❌ /delete テスト中にエラー:", err);
    });
}

// 7. 全テストを順番に実行
async function runAllTests() {
  console.log("====================================");
  console.log("🚀 integration.test.js: 総合テスト開始");
  console.log("====================================");

  await testDB();
  await testServer();
  await testRegister();
  await testLogin();
  await testUpdateUser();
  await testDeleteUser();

  console.log("\n====================================");
  console.log("🎉 全テスト完了");
  console.log("====================================");

  pool.end(); // DB接続を閉じる
}

runAllTests();

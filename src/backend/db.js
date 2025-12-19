//PostgreSQL接続設定（pgライブラリ）

const { Pool } = require('pg');

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'pomodoro_timer_mvp_v2',
  password: '19990120',
  port: 5432,
});

module.exports = pool;

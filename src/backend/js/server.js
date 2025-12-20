//Express等のエントリーポイント

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// ただし body-parser は最近は不要で、"app.use(express.json());"を使う方が現代的という一点だけアップデート余地がある。
// これを直せば、MVPのバックエンド初期設計としてかなり綺麗な流れになっている。  らしい

// 仮のルート
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

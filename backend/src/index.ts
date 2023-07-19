import express from "express";

// Expressアプリケーションインスタンスを作成します。
const app = express();

// ミドルウェアを設定します。ここではJSONの解析を行うミドルウェアを設定します。
app.use(express.json());

// ルートURL('/')へのGETリクエストに対するルートハンドラを設定します。
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Expressアプリケーションをポート3000で起動します。
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

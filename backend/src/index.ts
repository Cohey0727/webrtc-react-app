import express from "express";
import { Server as WebSocketServer } from "ws";
import { createServer } from "http";

// Expressアプリケーションインスタンスを作成します。
const app = express();

// HTTPサーバーを作成し、Expressアプリケーションを結びつけます。
const server = createServer(app);

// WebSocketサーバーを作成し、HTTPサーバーに接続します。
const wss = new WebSocketServer({ server });

// ルートURL('/')へのGETリクエストに対するルートハンドラを設定します。
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// 新しいWebSocket接続が開始されるたびに実行されるイベントハンドラを設定します。
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // WebSocketからメッセージが受信されるたびに実行されるイベントハンドラを設定します。
  ws.on("message", (message) => {
    console.log("Received: %s", message);
  });

  // WebSocketが閉じられるたびに実行されるイベントハンドラを設定します。
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Expressアプリケーションをポート3000で起動します。
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

import express from "express";
import cors from "cors";
import { WebSocket, Server as WebSocketServer } from "ws";
import { createServer } from "http";

// Expressアプリケーションインスタンスを作成します。
const app = express();
app.use(cors());

// HTTPサーバーを作成し、Expressアプリケーションを結びつけます。
const server = createServer(app);

// WebSocketサーバーを作成し、HTTPサーバーに接続します。
const wss = new WebSocketServer({ server });

// Provide STUN/TURN server information to clients
app.get("/webrtc-config", (req, res) => {
  res.json({
    iceServers: [
      { urls: ["stun:stun.l.google.com:19302"] },
      // You can add TURN server here
    ],
  });
});

const connections = new Set<WebSocket>();
// 新しいWebSocket接続が開始されるたびに実行されるイベントハンドラを設定します。
wss.on("connection", (ws) => {
  connections.add(ws);

  // WebSocketからメッセージが受信されるたびに実行されるイベントハンドラを設定します。
  ws.on("message", (message) => {
    // すべてのWebSocketにメッセージを送信します。
    connections.forEach((connection) => {
      connection.send(message);
    });
  });

  // WebSocketが閉じられるたびに実行されるイベントハンドラを設定します。
  ws.on("close", () => {
    connections.delete(ws);
  });
});

// Expressアプリケーションをポート3000で起動します。
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

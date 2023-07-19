"use client";
import React, { useEffect, useState } from "react";

function App() {
  // WebSocketオブジェクトを保持するstate
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされたときにWebSocket接続を開始
    const websocket = new WebSocket("ws://localhost:3000");

    // WebSocketの接続が開かれたときに実行されるイベントハンドラ
    websocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    // WebSocketからメッセージが受信されたときに実行されるイベントハンドラ
    websocket.onmessage = (event) => {
      console.log(`Received: ${event.data}`);
    };

    // WebSocketが閉じられたときに実行されるイベントハンドラ
    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(websocket);

    // コンポーネントがアンマウントされたときにWebSocket接続を閉じる
    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      ws.send("Hello from client!");
      console.log("Sent: Hello from client!");
    }
  };

  return (
    <div className="App">
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;

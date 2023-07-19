"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

function App() {
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsOpen, setWsOpen] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3000");
    websocket.onopen = () => {
      console.log("WebSocket connection opened");
      setWsOpen(true);
    };
    websocket.onmessage = async (event) => {
      const payload = await parseMessageEventData(event.data);
      console.log(`Received: ${JSON.stringify(payload)}`);
    };
    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (ws && message) {
      ws.send(message);
      setMessage("");
    }
  }, [message, ws]);

  const { data } = useSWR("/webrtc-config", getWebrtcConfig);

  const peerConnection = useMemo(() => {
    if (data) {
      return createPeerConnection(data);
    }
  }, [data]);

  useEffect(() => {
    if (peerConnection && ws && wsOpen) {
      (async () => {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await ws.send(JSON.stringify({ type: "offer", payload: offer }));
      })();
    }
  }, [peerConnection, ws, wsOpen]);

  return (
    <div>
      <input onChange={(e) => setMessage(e.target.value)} value={message} />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

async function getWebrtcConfig() {
  try {
    const url = "http://localhost:3000/webrtc-config";
    const res = await fetch(url);
    return res.json() as RTCConfiguration;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function createPeerConnection(config: RTCConfiguration) {
  const peerConnection = new RTCPeerConnection(config);
  return peerConnection;
}

async function parseMessageEventData<T>(data: any) {
  if (data instanceof Blob) {
    // Create a new FileReader object
    const reader = new FileReader();
    return new Promise<T>((resolve, reject) => {
      reader.onload = function () {
        resolve(JSON.parse(reader.result as string) as T);
      };
      reader.readAsText(data);
    });
  } else {
    console.log(`Received: ${data}`);
  }
}

export default App;

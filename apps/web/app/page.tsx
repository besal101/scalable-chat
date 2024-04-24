"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>
        <h1>All Messages will appear here</h1>
      </div>
      <div>
        <input
          placeholder="Enter your message"
          className={classes["chat-input"]}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(message);
              setMessage("");
            }
          }}
        />
        <button
          className={classes["chat-button"]}
          onClick={() => sendMessage(message)}
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
}

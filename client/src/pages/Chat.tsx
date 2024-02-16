// Chat.tsx
import React, { useEffect, useState, FormEvent } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((messages) => [...messages, msg]);

      // If the chat window is not currently focused, show a notification
      if (document.visibilityState === "hidden") {
        if (Notification.permission === "granted") {
          new Notification("New chat message", { body: msg });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("New chat message", { body: msg });
            }
          });
        }
      }
      
    });
  }, []);

  const submitMessage = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <div>
      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
      <form onSubmit={submitMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;

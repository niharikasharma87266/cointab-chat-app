// pages/index.js
"use client";

import { useState } from 'react';
import { Send, StopCircle } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatTitle, setChatTitle] = useState('Chat 1');

 const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { role: 'user', content: input };
  setMessages((prev) => [...prev, userMessage]);

  try {
    const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: input }) 
});
const data = await response.json();
console.log("LLM Response: ", data);
    
    const botMessage = { role: 'bot', content: data.response };
    setMessages((prev) => [...prev, botMessage]);
    setInput('');
  } catch (error) {
    console.error("Error sending message:", error);
  }
};


  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <button
          onClick={() => {
            setMessages([]);
            setChatTitle(`Chat ${Math.floor(Math.random() * 100)}`);
          }}
          className="mb-4 bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          New Chat
        </button>

        <div className="text-sm">
          <p className="text-gray-400">Previous Chats</p>
          <ul className="mt-2 space-y-1">
            <li className="bg-gray-800 p-2 rounded">{chatTitle}</li>
          </ul>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-white">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded-lg max-w-xl ${
                msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border rounded px-4 py-2"
            placeholder="Type your message..."
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded">
            <Send size={20} />
          </button>
          <button className="bg-red-600 text-white p-2 rounded">
            <StopCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

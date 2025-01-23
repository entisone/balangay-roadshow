# Lesson 3: AOConnect and Turbo-SDK

## 📖 Introduction

Welcome to Lesson 3! In this lesson, we'll explore how to build a **web interface** for our AO chat room using [ArNext](https://github.com/weavedb/arnext) and the Turbo-SDK. You'll learn how to create a decentralized frontend that connects to your AO processes and deploy it permanently to the Arweave network.

---

## 🏗️ Getting Started

### 1. Create a New ArNext Project

ArNext is a NextJS-based framework that allows you to deploy the same codebase on both Vercel and Arweave. This enables your permaapp to have cloud-powered optimizations while maintaining censorship resistance.

```bash
npx create-arnext-app my-ao-chat
cd my-ao-chat
```

### 2. Install Dependencies

```bash
npm install @permaweb/aoconnect @turbo-sdk/core
```

### 3. Create Basic Components

Create these essential components for your chat interface:

```tsx
// components/ConnectWallet.tsx
import { useState } from "react";

export function ConnectWallet({ onConnect }) {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    if (window.arweaveWallet) {
      await window.arweaveWallet.connect(["SIGN_TRANSACTION"]);
      setWallet(window.arweaveWallet);
      onConnect(window.arweaveWallet);
    }
  };

  return (
    <button onClick={connectWallet}>
      {wallet ? "Connected" : "Connect Wallet"}
    </button>
  );
}
```

```tsx
// components/ChatMessage.tsx
export function ChatMessage({ message, sender }) {
  return (
    <div className="message">
      <span className="sender">{sender}:</span>
      <p>{message}</p>
    </div>
  );
}
```

---

## ⚡ Connecting to AO Processes

### Setting up AOConnect

First, [install AOConnect](https://cookbook_ao.arweave.dev/guides/aoconnect/installing-connect.html) in your project:

```typescript
// hooks/useAOChat.ts
import { message, createDataItemSigner } from "@permaweb/aoconnect";

export function useAOChat(processId: string) {
  const sendMessage = async (wallet, content: string) => {
    try {
      const response = await message({
        process: processId,
        tags: [{ name: "Action", value: "Broadcast" }],
        signer: createDataItemSigner(wallet),
        data: content,
      });
      return response;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  return { sendMessage };
}
```

### Implementing Chat Interface

```tsx
// pages/index.tsx
import { useState } from "react";
import { ConnectWallet } from "../components/ConnectWallet";
import { ChatMessage } from "../components/ChatMessage";
import { useAOChat } from "../hooks/useAOChat";

export default function ChatRoom() {
  const [wallet, setWallet] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { sendMessage } = useAOChat("YOUR_PROCESS_ID");

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(wallet, input);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="chat-room">
      <ConnectWallet onConnect={setWallet} />
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
```

---

## 🛠️ Hands-on Activities

### Activity 1: Connect to Your Chat Process

1. Get your process ID from Lesson 2
2. Update the `useAOChat` hook with your process ID
3. Implement message sending functionality
4. Test sending and receiving messages

### Activity 2: Add Real-time Updates

1. Implement message monitoring using AOConnect
2. Update the UI when new messages arrive
3. Add loading states and error handling

---

## 🚀 Deployment

### Deploy to Vercel

```bash
vercel --prod
```

### Deploy to Arweave

```bash
yarn arweave
yarn deploy -w WALLET_PATH
```

Or using Turbo:

```bash
yarn deploy:turbo -w WALLET_PATH
```

---

## Expected Outcome

By completing this lesson, you will have:

- Created a permanent web application using ArNext
- Connected your frontend to AO processes using AOConnect
- Implemented real-time messaging capabilities
- Deployed your dApp to both Vercel and the permaweb

Let us know if you need any help during the activities. Happy coding! 🚀

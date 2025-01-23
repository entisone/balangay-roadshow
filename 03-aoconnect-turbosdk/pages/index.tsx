import { useState, useRef, useEffect } from "react";
import { ConnectWalletButton } from "@/components/connect-wallet";
import { useWallet } from "@/providers/wallet-provider";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { isConnected, userAddress } = useWallet();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setMessages((prev) => [
        ...prev,
        {
          sender: userAddress,
          content: input,
          timestamp: Date.now(),
        },
      ]);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col p-6 h-screen text-gray-800 bg-gradient-to-b from-gray-100 to-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          AO Chat
        </h1>
        <ConnectWalletButton />
      </div>

      {/* Chat Container */}
      <div className="overflow-y-auto flex-1 p-6 mb-6 rounded-lg border border-gray-200 backdrop-blur-sm bg-white/50">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 flex ${
                  msg.sender === userAddress ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.sender === userAddress ? "bg-blue-500" : "bg-gray-200"
                  } rounded-2xl px-4 py-3`}
                >
                  <div className="mb-1 text-sm text-gray-300">
                    {msg.sender.slice(0, 8)}:
                  </div>
                  <p
                    className={
                      msg.sender === userAddress
                        ? "text-white"
                        : "text-gray-200"
                    }
                  >
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <input
          className="flex-1 px-4 py-3 placeholder-gray-400 text-gray-800 rounded-lg border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isConnected ? "Type a message..." : "Connect wallet to chat"
          }
          disabled={!isConnected}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="px-6 py-3 font-medium text-white bg-blue-500 rounded-lg transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
}

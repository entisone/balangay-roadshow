import { useState, useRef, useEffect } from "react";
import { ConnectWalletButton } from "@/components/connect-wallet";
import { useWallet } from "@/providers/wallet-provider";
import { useReadMessages } from "@/hooks/useReadMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import { cn } from "@/lib/utils";
import { useRegistration } from "@/hooks/useRegistration";

export default function Home() {
  const [input, setInput] = useState("");
  const { isConnected, userAddress } = useWallet();
  const messagesEndRef = useRef(null);
  const {
    checkRegistration: {
      data: isRegistered,
      mutate: checkRegistration,
      isPending: isCheckingRegistration,
    },
    register: { mutate: register },
  } = useRegistration();
  const { data: messages } = useReadMessages();
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      sendMessage({ message: input });
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleRegister = async () => {
    await register();
    await checkRegistration();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        await checkRegistration();
      }
    })();
  }, [isConnected]);

  return (
    <div className="flex flex-col p-6 h-screen text-gray-800 bg-gradient-to-b from-gray-100 to-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          AO Chat
        </h1>

        <div className="flex gap-4">
          {isRegistered === 0 && (
            <button
              className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 disabled:opacity-50"
              onClick={handleRegister}
              disabled={!isConnected}
            >
              Register
            </button>
          )}

          <ConnectWalletButton />
        </div>
      </div>

      {/* Chat Container */}
      <div className="overflow-y-auto flex-1 p-6 mb-6 rounded-lg border border-gray-200 backdrop-blur-sm bg-white/50">
        {!isConnected ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Please connect your wallet.
          </div>
        ) : isCheckingRegistration ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Checking account status...
          </div>
        ) : !isRegistered ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            You are not registered! Please register to start chatting.
          </div>
        ) : !messages || messages.length === 0 ? (
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
                  <div
                    className={cn(
                      "mb-1 text-sm ",
                      msg.sender === userAddress
                        ? "text-gray-300"
                        : "text-gray-500"
                    )}
                  >
                    {msg.sender.slice(0, 8)}:
                  </div>
                  <p
                    className={
                      msg.sender === userAddress
                        ? "text-white"
                        : "text-gray-800"
                    }
                  >
                    {msg.message}
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
          disabled={!isConnected || isSendingMessage}
        >
          {isSendingMessage ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

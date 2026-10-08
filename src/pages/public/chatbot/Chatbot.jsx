import { useState, useRef, useEffect } from "react";
import { useSendMessageMutation } from '@/Services/sharedServices/chatapi';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";

const ChatBot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // ── Send message ──────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await sendMessage({ message: input, userId }).unwrap();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err?.data?.error ||
            "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    }
  };

  // ── Chat window sizing ────────────────────────────────
  const chatWindowClasses = isFullScreen
    ? "fixed inset-0 z-[9999] flex flex-col bg-white shadow-2xl"
    : [
      "fixed z-[9999] flex flex-col bg-white shadow-2xl rounded-2xl",
      // Responsive width & height
      "w-[calc(100vw-32px)] sm:w-[380px] md:w-[420px] lg:w-[460px]",
      "h-[70vh] max-h-[600px] min-h-[320px]",
      // Position: bottom-right, safe distance from edges
      "bottom-4 right-4 sm:bottom-6 sm:right-6",
    ].join(" ");

  return (
    <>
      {/* ── Fixed Chat Icon (hidden when open) ── */}
      {!isOpen && (
        <button
          aria-label="Open chat"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-colors flex items-center justify-center cursor-pointer"
          style={{ width: 56, height: 56 }}
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* ── Chat Window (fixed bottom-right, not draggable) ── */}
      {isOpen && (
        <div className={chatWindowClasses}>
          {/* Header */}
          <div className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="font-semibold text-base sm:text-lg">
                AI Assistant
              </span>
            </div>

            <div className="flex gap-2 items-center">
              {!isFullScreen ? (
                <button
                  onClick={() => setIsFullScreen(true)}
                  className="p-1 hover:bg-blue-600 rounded"
                  aria-label="Fullscreen"
                >
                  <Maximize2 size={17} />
                </button>
              ) : (
                <button
                  onClick={() => setIsFullScreen(false)}
                  className="p-1 hover:bg-blue-600 rounded"
                  aria-label="Minimize"
                >
                  <Minimize2 size={17} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-600 rounded"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-8">
                👋 Hi! How can I help you today?
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm max-w-[78%]"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm max-w-[82%]"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white p-3 flex gap-2 items-center flex-shrink-0 rounded-b-2xl">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors bg-gray-50"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full disabled:opacity-40 transition-colors flex-shrink-0"
              aria-label="Send"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
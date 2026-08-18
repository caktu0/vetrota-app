"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Headphones,
  Calendar,
  PhoneCall,
  CheckCircle2,
  Stethoscope,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const router = useRouter();
  const {
    messages,
    sendChatMessage,
    isChatLoading,
    isOperatorConnected,
    connectToOperator,
    currentUser,
  } = useApp();

  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isChatLoading) return;
    const text = inputVal;
    setInputVal("");
    await sendChatMessage(text);
  };

  const quickPrompts = [
    "Randevu almak istiyorum 📅",
    "Kedim iki gündür halsiz, ne yapmalıyım?",
    "Canlı destek veya operatöre bağlanmak istiyorum 👨‍⚕️",
    "Evde aşı ve parazit ücretleri nedir?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px] bg-white border border-[#E8DFD3] rounded-[24px] overflow-hidden shadow-sm animate-in fade-in duration-300">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#E8DFD3] bg-[#FFFDF9] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-[#C67B5C] text-white flex items-center justify-center text-xl shadow-sm">
              🐾
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#6B7B3C] border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base text-[#2D241E]">
                VetRota Asistan & Canlı Destek
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6B7B3C]/10 text-[#6B7B3C] border border-[#6B7B3C]/20">
                {isOperatorConnected ? "Canlı Hekim Aktif" : "Gemini 1.5 AI"}
              </span>
            </div>
            <p className="text-xs text-[#8B7355]">
              {isOperatorConnected
                ? "Nöbetçi Hekimimiz sohbete bağlandı"
                : "Sorularınızı yanıtlar, randevu ve acil yönlendirme sağlar"}
            </p>
          </div>
        </div>

        {!isOperatorConnected && (
          <Button
            size="sm"
            variant="outline"
            onClick={connectToOperator}
            className="text-xs border-[#C67B5C]/30 text-[#C67B5C] hover:bg-[#C67B5C]/10 rounded-xl gap-1.5 hidden sm:flex"
          >
            <Headphones className="w-3.5 h-3.5" />
            Canlı Hekime Bağlan
          </Button>
        )}
      </div>

      {/* Operator Connected Banner */}
      {isOperatorConnected && (
        <div className="bg-[#F0FDF4] border-b border-[#BBF7D0] p-2.5 px-4 flex items-center justify-between text-xs text-[#166534]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>
              <strong>Dr. Selin Aydın</strong> ile canlı görüşmedesiniz.
            </span>
          </div>
          <span className="text-[11px] text-[#15803D] bg-white px-2 py-0.5 rounded-md border border-[#BBF7D0]">
            Nöbetçi Hekim
          </span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FDFBF7]/60">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isOp = msg.sender === "operator";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[88%] sm:max-w-[75%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                  isUser
                    ? "bg-[#C67B5C] text-white"
                    : isOp
                    ? "bg-[#6B7B3C] text-white"
                    : "bg-[#FFF5EB] text-[#C67B5C] border border-[#C67B5C]/30"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : isOp ? <Stethoscope className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className="space-y-1">
                <div
                  className={`text-[10px] font-semibold px-1 ${
                    isUser ? "text-right text-[#8B7355]" : "text-left text-[#8B7355]"
                  }`}
                >
                  {msg.senderName} • {msg.timestamp}
                </div>

                <div
                  className={`p-3.5 rounded-[18px] text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    isUser
                      ? "bg-[#C67B5C] text-white rounded-tr-sm"
                      : isOp
                      ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#14532D] rounded-tl-sm font-medium"
                      : "bg-white border border-[#E8DFD3] text-[#2D241E] rounded-tl-sm"
                  }`}
                >
                  {msg.text}

                  {/* Contextual Action Buttons */}
                  {msg.actionType === "BOOKING_LINK" && (
                    <div className="mt-3 pt-3 border-t border-[#E8DFD3] flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push("/booking")}
                        className="bg-[#C67B5C] hover:bg-[#B5651D] text-white text-xs font-bold rounded-xl gap-1.5 h-9"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Randevu Ekranına Git
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/services")}
                        className="text-xs rounded-xl h-9 border-[#E8DFD3] text-[#2D241E]"
                      >
                        Hizmetleri İncele
                      </Button>
                    </div>
                  )}

                  {msg.actionType === "LIVE_SUPPORT_CONNECTED" && (
                    <div className="mt-3 pt-2 text-xs text-[#15803D] flex items-center gap-1.5 font-bold">
                      <PhoneCall className="w-3.5 h-3.5" />
                      Doğrudan hekim hattı aktif
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isChatLoading && (
          <div className="flex items-center gap-2 text-xs text-[#8B7355] p-3 rounded-2xl bg-white border border-[#E8DFD3] w-fit">
            <Sparkles className="w-4 h-4 text-[#C67B5C] animate-spin" />
            <span>VetRota AI yanıt hazırlıyor...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 px-4 bg-[#FFFDF9] border-t border-[#F4EFE6] overflow-x-auto flex gap-2 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendChatMessage(prompt)}
            className="text-xs bg-white hover:bg-[#FFF5EB] border border-[#E8DFD3] hover:border-[#C67B5C]/50 text-[#5C3D2E] px-3 py-1.5 rounded-full whitespace-nowrap transition-all shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-[#E8DFD3] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Dostunuzun durumunu yazın veya randevu isteyin..."
          className="flex-1 px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#E8DFD3] text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]/30"
        />

        <Button
          type="submit"
          disabled={!inputVal.trim() || isChatLoading}
          className="bg-[#C67B5C] hover:bg-[#B5651D] text-white rounded-xl h-11 px-4 font-bold shadow-sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}

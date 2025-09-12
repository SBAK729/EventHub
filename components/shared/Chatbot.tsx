"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Bot, User } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hello! I'm your EventHub assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()
  const sessionId = user?.primaryEmailAddress?.emailAddress || "guest"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("https://grad-backend-uaju.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          session_id: sessionId,
          retrieval_mode: "combined",
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || "Sorry, I couldn’t process that request.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "⚠ Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-105 shadow-xl z-50 transition"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-[500px] shadow-2xl z-50 flex flex-col rounded-2xl overflow-hidden backdrop-blur-md bg-white/90 dark:bg-[#11121a]/90 border border-purple-200 dark:border-purple-700">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-lg font-semibold">EventHub Assistant</CardTitle>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] w-fit break-words whitespace-pre-wrap rounded-2xl px-4 py-3 shadow ${
                      message.isUser
                        ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                        : "bg-gray-100 dark:bg-[#1a1b2a] text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />}
                      <div>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-[10px] opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {message.isUser && <User className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-80" />}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-[#1a1b2a] rounded-2xl px-4 py-3 shadow flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-[#0f1018]">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Press Esc to close)"
                  className="flex-1 bg-white dark:bg-[#1a1b2a] dark:text-white rounded-full px-4"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-105 transition rounded-full"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> to close
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default Chatbot

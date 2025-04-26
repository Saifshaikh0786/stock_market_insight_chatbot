"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Send,
  TrendingUp,
  Sparkles,
  Lightbulb,
  BarChart2,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { generateChatResponse } from "@/lib/gemini"
import { StockTickerWidget } from "@/components/stock-ticker-widget"
import { MessageFormatter } from "@/components/message-formatter"
import { UserProfile } from "@/components/user-profile"
import { FeaturedStocks } from "@/components/featured-stocks"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI stock market assistant. Ask me about market trends, stock analysis, or investment strategies.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [suggestedQuestions] = useState([
    "What are the top performing tech stocks this month?",
    "Explain the concept of dollar-cost averaging",
    "How do interest rates affect the stock market?",
    "What's your analysis on NVIDIA stock?",
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Add a placeholder for the assistant's message with typing indicator
    const placeholderId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: placeholderId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      },
    ])

    try {
      const response = await generateChatResponse(
        messages.map((msg) => ({ role: msg.role, content: msg.content })),
        input,
      )

      // Replace the placeholder with the actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholderId
            ? {
                id: placeholderId,
                role: "assistant",
                content: response,
                timestamp: new Date(),
                isTyping: false,
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error generating response:", error)

      // Replace the placeholder with an error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholderId
            ? {
                id: placeholderId,
                role: "assistant",
                content: "I'm sorry, I encountered an error processing your request. Please try again.",
                timestamp: new Date(),
                isTyping: false,
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const handleTypingComplete = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isTyping: false,
            }
          : msg,
      ),
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-0.5 rounded-full">
                <TrendingUp className="h-5 w-5 text-white bg-slate-900 rounded-full p-0.5" />
              </div>
              <span className="font-bold">StockSage</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StockTickerWidget />
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 container mx-auto max-w-5xl">
          <div className="space-y-6 py-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex items-start gap-3 max-w-3xl", message.role === "user" ? "ml-auto" : "mr-auto")}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-10 w-10 border-2 border-slate-700 bg-slate-800">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white">
                        AI
                      </AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    </Avatar>
                  )}
                  <Card
                    className={cn(
                      "border-slate-800 shadow-lg",
                      message.role === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-700"
                        : "bg-slate-900/80 backdrop-blur-sm",
                    )}
                  >
                    <CardContent className="p-4 sm:p-5">
                      {message.role === "assistant" ? (
                        <MessageFormatter
                          content={message.content}
                          isTyping={!!message.isTyping}
                          onTypingComplete={() => handleTypingComplete(message.id)}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                      <div
                        className={cn(
                          "text-xs mt-2 flex items-center",
                          message.role === "user" ? "text-emerald-200" : "text-slate-500",
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {message.role === "assistant" && !message.isTyping && (
                          <span className="ml-2 flex items-center text-emerald-500">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Generated
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {message.role === "user" && (
                    <Avatar className="h-10 w-10 border-2 border-emerald-700 bg-emerald-800">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        JD
                      </AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 max-w-3xl"
              >
                <Avatar className="h-10 w-10 border-2 border-slate-700 bg-slate-800">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white">
                    AI
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800 shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-300"></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className="w-80 border-l border-slate-800 bg-slate-900/30 backdrop-blur-sm p-4 overflow-y-auto hidden lg:block"
            >
              <div className="space-y-6">
                <FeaturedStocks />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <h3 className="font-bold">Suggested Questions</h3>
                  </div>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2 border-slate-800 bg-slate-800/50 hover:bg-slate-800"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-blue-500" />
                    <h3 className="font-bold">Market Overview</h3>
                  </div>
                  <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">S&P 500</span>
                        <div className="flex items-center text-emerald-500 text-sm">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          <span>0.75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">NASDAQ</span>
                        <div className="flex items-center text-emerald-500 text-sm">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          <span>1.12%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">DOW</span>
                        <div className="flex items-center text-emerald-500 text-sm">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          <span>0.43%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">10Y Treasury</span>
                        <div className="flex items-center text-red-500 text-sm">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          <span>0.05%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle sidebar button (visible on large screens) */}
        <div className="hidden lg:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            {showSidebar ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <footer className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm p-4 sticky bottom-0">
        <div className="container mx-auto max-w-5xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about stocks, market trends, or investment advice..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
              disabled={isLoading}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>

          {/* Suggested questions (mobile only) */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-xs"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, ChevronRight, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

type StockData = {
  symbol: string
  name: string
  price: number
  change: number
  volume: string
  marketCap: string
}

const stockCategories = {
  trending: [
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 824.15, change: 5.67, volume: "45.2M", marketCap: "2.03T" },
    { symbol: "AAPL", name: "Apple Inc.", price: 189.45, change: 1.23, volume: "62.8M", marketCap: "2.95T" },
    { symbol: "MSFT", name: "Microsoft Corporation", price: 415.32, change: 2.45, volume: "28.3M", marketCap: "3.08T" },
    { symbol: "META", name: "Meta Platforms Inc.", price: 472.21, change: 3.56, volume: "18.7M", marketCap: "1.21T" },
  ],
  gainers: [
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 824.15, change: 5.67, volume: "45.2M", marketCap: "2.03T" },
    { symbol: "META", name: "Meta Platforms Inc.", price: 472.21, change: 3.56, volume: "18.7M", marketCap: "1.21T" },
    { symbol: "NFLX", name: "Netflix, Inc.", price: 632.78, change: 4.56, volume: "12.4M", marketCap: "276.5B" },
    {
      symbol: "DIS",
      name: "The Walt Disney Company",
      price: 112.45,
      change: 2.34,
      volume: "15.8M",
      marketCap: "205.7B",
    },
  ],
  losers: [
    { symbol: "TSLA", name: "Tesla, Inc.", price: 245.67, change: -1.34, volume: "32.6M", marketCap: "781.2B" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.89, change: -0.78, volume: "24.1M", marketCap: "1.79T" },
    { symbol: "PFE", name: "Pfizer Inc.", price: 28.45, change: -1.23, volume: "38.5M", marketCap: "161.3B" },
    { symbol: "WMT", name: "Walmart Inc.", price: 67.89, change: -0.34, volume: "14.2M", marketCap: "547.8B" },
  ],
  watchlist: [
    { symbol: "AAPL", name: "Apple Inc.", price: 189.45, change: 1.23, volume: "62.8M", marketCap: "2.95T" },
    { symbol: "MSFT", name: "Microsoft Corporation", price: 415.32, change: 2.45, volume: "28.3M", marketCap: "3.08T" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.12, change: 0.92, volume: "41.3M", marketCap: "1.85T" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 198.34, change: 0.45, volume: "9.7M", marketCap: "572.1B" },
  ],
}

export function FeaturedStocks() {
  const [category, setCategory] = useState<"trending" | "gainers" | "losers" | "watchlist">("trending")
  const [hoveredStock, setHoveredStock] = useState<string | null>(null)

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h3 className="font-bold">Market Pulse</h3>
          </div>
          <Tabs value={category} onValueChange={(value) => setCategory(value as any)} className="h-8">
            <TabsList className="bg-slate-800/50 h-8">
              <TabsTrigger value="trending" className="h-7 text-xs">
                Trending
              </TabsTrigger>
              <TabsTrigger value="gainers" className="h-7 text-xs">
                Gainers
              </TabsTrigger>
              <TabsTrigger value="losers" className="h-7 text-xs">
                Losers
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="h-7 text-xs">
                Watchlist
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar">
          {stockCategories[category].map((stock) => (
            <motion.div
              key={stock.symbol}
              className="flex items-center justify-between p-2 rounded-md hover:bg-slate-800/50 transition-colors cursor-pointer"
              onHoverStart={() => setHoveredStock(stock.symbol)}
              onHoverEnd={() => setHoveredStock(null)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-800 font-bold text-sm">
                  {stock.symbol.substring(0, 2)}
                </div>
                <div className="min-w-0 overflow-hidden">
                  <div className="font-medium truncate">{stock.symbol}</div>
                  <div className="text-xs text-slate-400 truncate">{stock.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {hoveredStock === stock.symbol && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-slate-400 hidden sm:flex gap-2"
                  >
                    <span>Vol: {stock.volume}</span>
                    <span>Cap: {stock.marketCap}</span>
                  </motion.div>
                )}

                <div className="text-right">
                  <div className="font-medium">${stock.price.toFixed(2)}</div>
                  <div
                    className={`text-xs flex items-center justify-end ${stock.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {stock.change >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(stock.change).toFixed(2)}%
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

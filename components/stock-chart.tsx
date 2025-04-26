"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Sample stock data
const stockData = {
  "1D": [
    { time: "9:30", value: 185.42 },
    { time: "10:00", value: 186.21 },
    { time: "10:30", value: 185.89 },
    { time: "11:00", value: 186.55 },
    { time: "11:30", value: 187.01 },
    { time: "12:00", value: 186.78 },
    { time: "12:30", value: 187.13 },
    { time: "13:00", value: 187.45 },
    { time: "13:30", value: 187.98 },
    { time: "14:00", value: 188.32 },
    { time: "14:30", value: 188.12 },
    { time: "15:00", value: 188.67 },
    { time: "15:30", value: 189.01 },
    { time: "16:00", value: 189.45 },
  ],
  "1W": [
    { time: "Mon", value: 184.12 },
    { time: "Tue", value: 185.45 },
    { time: "Wed", value: 186.78 },
    { time: "Thu", value: 187.32 },
    { time: "Fri", value: 189.45 },
  ],
  "1M": [
    { time: "Week 1", value: 175.32 },
    { time: "Week 2", value: 179.45 },
    { time: "Week 3", value: 183.67 },
    { time: "Week 4", value: 189.45 },
  ],
  "3M": [
    { time: "Jan", value: 165.78 },
    { time: "Feb", value: 172.34 },
    { time: "Mar", value: 189.45 },
  ],
  "1Y": [
    { time: "Q1", value: 145.67 },
    { time: "Q2", value: 156.89 },
    { time: "Q3", value: 172.34 },
    { time: "Q4", value: 189.45 },
  ],
}

export function StockChart() {
  const [timeframe, setTimeframe] = useState("1M")
  const data = stockData[timeframe as keyof typeof stockData]

  const startValue = data[0].value
  const endValue = data[data.length - 1].value
  const change = endValue - startValue
  const percentChange = ((change / startValue) * 100).toFixed(2)
  const isPositive = change >= 0

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">AAPL</h3>
            <p className="text-sm text-slate-400">Apple Inc.</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">${endValue.toFixed(2)}</div>
            <div className={`text-sm ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
              {isPositive ? "+" : ""}
              {change.toFixed(2)} ({isPositive ? "+" : ""}
              {percentChange}%)
            </div>
          </div>
        </div>

        <div className="h-[300px] mt-6">
          <ChartContainer
            config={{
              value: {
                label: "Price",
                color: isPositive ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(0, 84.2%, 60.2%)",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(0, 84.2%, 60.2%)"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(0, 84.2%, 60.2%)"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "hsl(215.4, 16.3%, 56.9%)" }} />
                <YAxis
                  domain={["dataMin - 5", "dataMax + 5"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(215.4, 16.3%, 56.9%)" }}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(0, 84.2%, 60.2%)"}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <Tabs value={timeframe} onValueChange={setTimeframe} className="mt-4">
          <TabsList className="grid grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, LogOut, Settings, UserIcon, Wallet, Star, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function UserProfile() {
  const [notifications, setNotifications] = useState(3)

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-800">
        <Bell className="h-5 w-5" />
        {notifications > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
            {notifications}
          </span>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-800">
            <Avatar className="h-8 w-8 border-2 border-emerald-600">
              <AvatarFallback className="bg-slate-800 text-emerald-500">JD</AvatarFallback>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">John Doe</span>
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className="px-1 py-0 h-4 text-[10px] bg-emerald-950/30 text-emerald-400 border-emerald-800"
                >
                  Premium
                </Badge>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
          <DropdownMenuLabel className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-0.5 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-slate-900">
                <AvatarFallback className="bg-slate-800 text-emerald-500">JD</AvatarFallback>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
              </Avatar>
            </div>
            <div>
              <div className="font-bold">John Doe</div>
              <div className="text-xs text-slate-400">john.doe@example.com</div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-800" />
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-800">
            <UserIcon className="h-4 w-4 text-slate-400" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-800">
            <Wallet className="h-4 w-4 text-slate-400" />
            <span>Portfolio</span>
            <Badge className="ml-auto bg-emerald-600 text-[10px]">New</Badge>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-800">
            <Star className="h-4 w-4 text-slate-400" />
            <span>Watchlist</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-800">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>Learning Center</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-800" />
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-800">
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 text-red-500 cursor-pointer hover:bg-slate-800">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

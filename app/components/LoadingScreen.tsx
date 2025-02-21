"use client"

import { useState, useEffect } from "react"
import { Headphones } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setTimeout(() => onLoadingComplete(), 500) // Delay to show 100% briefly
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 200)

    return () => clearInterval(timer)
  }, [onLoadingComplete])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white">
      <div className="animate-bounce mb-8">
        <Headphones size={64} />
      </div>
      <h1 className="text-2xl font-bold mb-4">טוען את מערכת ניהול הצוערים...</h1>
      <Progress value={progress} className="w-64" />
    </div>
  )
}


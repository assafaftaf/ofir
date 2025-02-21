"use client"

import { useState, useEffect } from "react"
import LoadingScreen from "./components/LoadingScreen"
import MainScreen from "./components/MainScreen"
import AddCadetScreen from "./components/AddCadetScreen"
import CadetListScreen from "./components/CadetListScreen"
import CadetDetailScreen from "./components/CadetDetailScreen"
import EditCadetScreen from "./components/EditCadetScreen"
import ProgressTrackingScreen from "./components/ProgressTrackingScreen"
import { Toaster } from "@/components/ui/toaster"
import type { Cadet } from "./contexts/CadetContext"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentScreen, setCurrentScreen] = useState<
    "main" | "addCadet" | "cadetList" | "cadetDetail" | "editCadet" | "progressTracking"
  >("main")
  const [selectedCadet, setSelectedCadet] = useState<Cadet | null>(null)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {currentScreen === "main" && (
        <MainScreen
          onAddCadet={() => setCurrentScreen("addCadet")}
          onViewCadetList={() => setCurrentScreen("cadetList")}
          onViewProgressTracking={() => setCurrentScreen("progressTracking")}
        />
      )}
      {currentScreen === "addCadet" && <AddCadetScreen onBack={() => setCurrentScreen("main")} />}
      {currentScreen === "cadetList" && (
        <CadetListScreen
          onBack={() => setCurrentScreen("main")}
          onSelectCadet={(cadet) => {
            setSelectedCadet(cadet)
            setCurrentScreen("cadetDetail")
          }}
          onEditCadet={(cadet) => {
            setSelectedCadet(cadet)
            setCurrentScreen("editCadet")
          }}
        />
      )}
      {currentScreen === "cadetDetail" && selectedCadet && (
        <CadetDetailScreen cadet={selectedCadet} onBack={() => setCurrentScreen("cadetList")} />
      )}
      {currentScreen === "editCadet" && selectedCadet && (
        <EditCadetScreen cadet={selectedCadet} onBack={() => setCurrentScreen("cadetList")} />
      )}
      {currentScreen === "progressTracking" && <ProgressTrackingScreen onBack={() => setCurrentScreen("main")} />}
      <Toaster />
    </main>
  )
}


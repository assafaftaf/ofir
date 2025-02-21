import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Heebo } from "next/font/google"
import { CadetProvider } from "./contexts/CadetContext"

const heebo = Heebo({ subsets: ["hebrew"] })

export const metadata: Metadata = {
  title: "מערכת ניהול צוערים",
  description: "אפליקציה לניהול ומעקב אחר צוערים",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>
        <CadetProvider>{children}</CadetProvider>
      </body>
    </html>
  )
}



import './globals.css'
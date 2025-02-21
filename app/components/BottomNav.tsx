import Link from "next/link"
import { Home, Users, FileText } from "lucide-react"

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          <Link href="/" className="flex flex-col items-center">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">בית</span>
          </Link>
          <Link href="/cadets" className="flex flex-col items-center">
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">צוערים</span>
          </Link>
          <Link href="/reports" className="flex flex-col items-center">
            <FileText className="h-6 w-6" />
            <span className="text-xs mt-1">דוחות</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}


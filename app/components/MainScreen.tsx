import { UserPlus, Users, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCadetContext } from "../contexts/CadetContext"

interface MainScreenProps {
  onAddCadet: () => void
  onViewCadetList: () => void
  onViewProgressTracking: () => void
}

export default function MainScreen({ onAddCadet, onViewCadetList, onViewProgressTracking }: MainScreenProps) {
  const { cadets } = useCadetContext()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">מערכת ניהול צוערים</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-500 text-white">
          <CardContent className="flex flex-col items-center p-6">
            <UserPlus className="h-12 w-12 mb-4" />
            <Button onClick={onAddCadet} variant="secondary" className="w-full">
              הוספת צוער
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white">
          <CardContent className="flex flex-col items-center p-6">
            <Users className="h-12 w-12 mb-4" />
            <Button onClick={onViewCadetList} variant="secondary" className="w-full">
              רשימת צוערים
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-teal-500 text-white">
          <CardContent className="flex flex-col items-center p-6">
            <LineChart className="h-12 w-12 mb-4" />
            <Button onClick={onViewProgressTracking} variant="secondary" className="w-full">
              מעקב התקדמות
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <CardContent className="flex flex-col items-center p-6">
            <Users className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">מספר צוערים כולל</h2>
            <p className="text-4xl font-bold">{cadets.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


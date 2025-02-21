import { UserPlus, Users, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function MainNavigation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="flex flex-col items-center p-6">
          <UserPlus className="h-12 w-12 text-blue-500 mb-4" />
          <Button className="w-full">הוסף צוער</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center p-6">
          <Users className="h-12 w-12 text-blue-500 mb-4" />
          <Button className="w-full">רשימת צוערים</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center p-6">
          <LineChart className="h-12 w-12 text-blue-500 mb-4" />
          <Button className="w-full">מעקב התקדמות</Button>
        </CardContent>
      </Card>
    </div>
  )
}


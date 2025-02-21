import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DynamicInfo() {
  // These would typically come from an API or database
  const totalCadets = 150
  const averageScore = 85.5
  const recentlyAddedCadets = 5
  const cadetsWithoutPracticalScores = 3

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך הכל צוערים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCadets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ממוצע ציונים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">צוערים חדשים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentlyAddedCadets}</div>
          </CardContent>
        </Card>
      </div>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>שים לב</AlertTitle>
        <AlertDescription>{cadetsWithoutPracticalScores} צוערים ללא ציונים מעשיים</AlertDescription>
      </Alert>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import type { Cadet } from "../contexts/CadetContext"

interface ExamCategory {
  name: string
  openingScore: number | null
  closingScore: number | null
}

const initialCategories: ExamCategory[] = [
  { name: "מבואות חיל האוויר", openingScore: null, closingScore: null },
  { name: 'הגנ"א מבואות', openingScore: null, closingScore: null },
  { name: "תעבורה מבואות", openingScore: null, closingScore: null },
  { name: "טכני עיוני", openingScore: null, closingScore: null },
  { name: "טכני מעשי", openingScore: null, closingScore: null },
  { name: "גילוי", openingScore: null, closingScore: null },
  { name: 'הגנ"א בסיסי', openingScore: null, closingScore: null },
  { name: 'מענ"ש קרקעי', openingScore: null, closingScore: null },
  { name: "תעבורה בסיסי", openingScore: null, closingScore: null },
  { name: "ACC", openingScore: null, closingScore: null },
  { name: 'הגנ"א מתקדם', openingScore: null, closingScore: null },
  { name: "תעבורה מתקדם", openingScore: null, closingScore: null },
  { name: "קרבות", openingScore: null, closingScore: null },
]

interface TheoreticalExamsScreenProps {
  cadet: Cadet
}

export default function TheoreticalExamsScreen({ cadet }: TheoreticalExamsScreenProps) {
  const [categories, setCategories] = useState<ExamCategory[]>(initialCategories)
  const router = useRouter()

  const handleScoreChange = (index: number, examType: "openingScore" | "closingScore", value: string) => {
    const newCategories = [...categories]
    newCategories[index][examType] = value === "" ? null : Number(value)
    setCategories(newCategories)
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-500"
    return score >= 80 ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">מבחנים עיוניים: {cadet.fullName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`opening-${index}`}>מבחן פתיחה</Label>
                  <Input
                    id={`opening-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={category.openingScore === null ? "" : category.openingScore}
                    onChange={(e) => handleScoreChange(index, "openingScore", e.target.value)}
                    className={getScoreColor(category.openingScore)}
                  />
                </div>
                <div>
                  <Label htmlFor={`closing-${index}`}>מבחן סיום</Label>
                  <Input
                    id={`closing-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={category.closingScore === null ? "" : category.closingScore}
                    onChange={(e) => handleScoreChange(index, "closingScore", e.target.value)}
                    className={getScoreColor(category.closingScore)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button onClick={() => router.back()}>חזרה לדף האישי</Button>
      </div>
    </div>
  )
}


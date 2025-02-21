"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import React from "react"

export type TheoreticalExam = {
  category: string
  exams: Array<{
    name: string
    scores: Array<number | null>
  }>
}

const initialCategories: TheoreticalExam[] = [
  {
    category: "מבואות חיל האוויר",
    exams: [
      { name: 'בוט"ים', scores: [null] },
      { name: "א'-ב' פונטי", scores: [null] },
      { name: "מסכם", scores: [null] },
    ],
  },
  {
    category: 'הגנ"א מבואות',
    exams: [
      { name: "רחל 01", scores: [null] },
      { name: "מספרי עדכון", scores: [null] },
      { name: "מסכם", scores: [null] },
    ],
  },
  {
    category: "תעבורה מבואות",
    exams: [
      { name: "מפה", scores: [null] },
      { name: "פתיחה", scores: [null] },
      { name: "מסכם", scores: [null] },
    ],
  },
  {
    category: "טכני עיוני",
    exams: [
      { name: 'מכ"ם', scores: [null] },
      { name: "קשר", scores: [null] },
      { name: 'תמונ"א', scores: [null] },
    ],
  },
  {
    category: "טכני מעשי",
    exams: [
      { name: 'מכ"מ', scores: [null] },
      { name: 'תמונ"א', scores: [null] },
      { name: "קשר", scores: [null] },
    ],
  },
  {
    category: "גילוי",
    exams: [{ name: "פתיחה", scores: [null] }],
  },
  {
    category: 'הגנ"א בסיסי',
    exams: [{ name: "מסכם", scores: [null] }],
  },
  {
    category: 'מענ"ש קרקעי',
    exams: [{ name: "מסכם", scores: [null] }],
  },
  {
    category: "תעבורה בסיסי",
    exams: [
      { name: "מפה", scores: [null] },
      { name: "כניסה", scores: [null] },
      { name: "מסכם", scores: [null] },
    ],
  },
  {
    category: "ACC",
    exams: [
      { name: "עיוני", scores: [null] },
      { name: "מעשי", scores: [null] },
    ],
  },
  {
    category: 'הגנ"א מתקדם',
    exams: [{ name: "מסכם", scores: [null] }],
  },
  {
    category: "תעבורה מתקדם",
    exams: [
      { name: "מפה", scores: [null] },
      { name: "פתיחה", scores: [null] },
      { name: "מסכם", scores: [null] },
    ],
  },
  {
    category: "קרבות",
    exams: [
      { name: "אזימוטווח", scores: [null] },
      { name: "ירוט נקודה", scores: [null] },
      { name: "ירוט 90", scores: [null] },
      { name: 'תיאורי תמונ"א', scores: [null] },
      { name: "פתיחה", scores: [null] },
      { name: "מעשי", scores: [null] },
    ],
  },
]

interface TheoreticalExamsProps {
  exams: TheoreticalExam[]
  onUpdate: (exams: TheoreticalExam[]) => void
}

export default function TheoreticalExams({ exams, onUpdate }: TheoreticalExamsProps) {
  const [categories, setCategories] = useState<TheoreticalExam[]>(exams.length ? exams : initialCategories)

  useEffect(() => {
    if (exams.length) {
      setCategories(exams)
    }
  }, [exams])

  const handleScoreChange = (categoryIndex: number, examIndex: number, attemptIndex: number, value: string) => {
    const newCategories = [...categories]
    const newScore = value === "" ? null : Number(value)

    while (newCategories[categoryIndex].exams[examIndex].scores.length <= attemptIndex) {
      newCategories[categoryIndex].exams[examIndex].scores.push(null)
    }

    newCategories[categoryIndex].exams[examIndex].scores[attemptIndex] = newScore

    setCategories(newCategories)
    onUpdate(newCategories)
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-500"
    return score >= 80 ? "text-green-500" : "text-red-500"
  }

  const renderScoreInputs = (categoryIndex: number, examIndex: number, scores: (number | null)[]) => {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {scores.map((score, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Separator orientation="vertical" className="h-8 hidden sm:block" />}
            <div className="flex flex-col items-center">
              <Label className="text-xs mb-1">
                מועד {index === 0 ? "א'" : index === 1 ? "ב'" : index === 2 ? "ג'" : "ד'"}
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={score === null ? "" : score}
                onChange={(e) => handleScoreChange(categoryIndex, examIndex, index, e.target.value)}
                className={`${getScoreColor(score)} w-16 text-center`}
              />
            </div>
          </React.Fragment>
        ))}
        {scores[scores.length - 1] !== null && scores[scores.length - 1]! < 80 && scores.length < 4 && (
          <>
            <Separator orientation="vertical" className="h-8 hidden sm:block" />
            <div className="flex flex-col items-center">
              <Label className="text-xs mb-1">
                מועד {scores.length === 1 ? "ב'" : scores.length === 2 ? "ג'" : "ד'"}
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value=""
                onChange={(e) => handleScoreChange(categoryIndex, examIndex, scores.length, e.target.value)}
                className="w-16 text-center"
              />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-right" dir="rtl">
      {categories.map((category, categoryIndex) => (
        <Card key={category.category} className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.exams.map((exam, examIndex) => (
                <div key={exam.name} className="space-y-2">
                  <Label className="block text-sm font-medium">{exam.name}</Label>
                  {renderScoreInputs(categoryIndex, examIndex, exam.scores)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


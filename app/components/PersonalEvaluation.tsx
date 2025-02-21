"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCadetContext, type PersonalEvaluationData } from "../contexts/CadetContext"

interface PersonalEvaluationProps {
  cadetId: string
}

const evaluationCategories = {
  character: {
    title: "דמות",
    criteria: [
      "דוגמה אישית",
      "יכולת פיקוד והובלה",
      "מיקום המפקד",
      "יחסי אנוש",
      "משמעת ומשמעת עצמית",
      "התמודדות ותפקוד בתנאי לחץ ועומס",
      "אומץ",
      "איתנות",
      "אמינות",
    ],
  },
  officership: {
    title: "קצינות",
    criteria: [
      "עצמאות בביצוע המשימות",
      "ניהול זמן ותעדוף משימות",
      "השקעה ומוטיבציה",
      "אחריות",
      "יוזמה",
      "עבודה בצוות",
      "אחריות מרחיבה",
      "יכולת תחקור וקבלת ביקורת",
    ],
  },
  professionalSkills: {
    title: "מיומנות מקצועית",
    criteria: [
      "עבודה בצוות",
      'קריאה ועיבוד תמונ"א',
      'שימוש ומיצוי מלא של אמל"ח הליבה',
      "בקרת תהליך",
      'נדב"ר תכליתי, חודר תודעה ובעל טונציה מתאימה',
      "שיטת עבודה סדורה",
      "העברת מידע באופן מדויק ומתוזמן",
      "הפקת לקחים והטמעתם בזמן אמת",
      "מודעות מצבית, תגובה והתמודדות",
      "קבלת החלטות בקבועי זמן קצרים ובמידע חסר",
    ],
  },
}

const getScoreColor = (score: number | null) => {
  if (score === null) return "bg-gray-200"
  if (score <= 6) return "bg-red-500 text-white"
  if (score >= 8) return "bg-green-500 text-white"
  return ""
}

const calculateAverage = (scores: (number | null)[]) => {
  const validScores = scores.filter((score): score is number => score !== null)
  return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : null
}

export default function PersonalEvaluation({ cadetId }: PersonalEvaluationProps) {
  const { cadets, updatePersonalEvaluation } = useCadetContext()
  const cadet = cadets.find((c) => c.id === cadetId)
  const [evaluationData, setEvaluationData] = useState<PersonalEvaluationData>({
    character: {},
    officership: {},
    professionalSkills: {},
  })

  useEffect(() => {
    if (cadet && cadet.personalEvaluation) {
      setEvaluationData(cadet.personalEvaluation)
    }
  }, [cadet])

  const handleScoreChange = (
    category: keyof PersonalEvaluationData,
    criterion: string,
    role: "commander" | "cadet",
    value: string,
  ) => {
    const score = value === "" ? null : Number.parseInt(value, 10)
    const newData = {
      ...evaluationData,
      [category]: {
        ...evaluationData[category],
        [criterion]: {
          ...evaluationData[category][criterion],
          [role]: score,
        },
      },
    }
    setEvaluationData(newData)
    updatePersonalEvaluation(cadetId, newData)
  }

  const averages = useMemo(() => {
    const result: { [key: string]: { commander: number | null; cadet: number | null } } = {}
    Object.keys(evaluationCategories).forEach((category) => {
      const commanderScores = Object.values(evaluationData[category as keyof PersonalEvaluationData]).map(
        (v) => v.commander,
      )
      const cadetScores = Object.values(evaluationData[category as keyof PersonalEvaluationData]).map((v) => v.cadet)
      result[category] = {
        commander: calculateAverage(commanderScores),
        cadet: calculateAverage(cadetScores),
      }
    })
    return result
  }, [evaluationData])

  const overallAverage = useMemo(() => {
    const commanderScores = Object.values(averages).map((v) => v.commander)
    const cadetScores = Object.values(averages).map((v) => v.cadet)
    return {
      commander: calculateAverage(commanderScores),
      cadet: calculateAverage(cadetScores),
    }
  }, [averages])

  if (!cadet) return null

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-center">חוו"ד אישי</h2>
      {Object.entries(evaluationCategories).map(([category, { title, criteria }]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2 text-right">קריטריון</TableHead>
                  <TableHead className="w-1/4 text-center">ציון מפקד</TableHead>
                  <TableHead className="w-1/4 text-center">ציון צוער</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map((criterion) => (
                  <TableRow key={criterion}>
                    <TableCell className="text-right">{criterion}</TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={
                          evaluationData[category as keyof PersonalEvaluationData][criterion]?.commander?.toString() ||
                          ""
                        }
                        onValueChange={(value) =>
                          handleScoreChange(category as keyof PersonalEvaluationData, criterion, "commander", value)
                        }
                      >
                        <SelectTrigger
                          className={`w-20 mx-auto ${getScoreColor(evaluationData[category as keyof PersonalEvaluationData][criterion]?.commander)}`}
                        >
                          <SelectValue placeholder="מפקד" />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 5, 6, 7, 8, 9, 10].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={
                          evaluationData[category as keyof PersonalEvaluationData][criterion]?.cadet?.toString() || ""
                        }
                        onValueChange={(value) =>
                          handleScoreChange(category as keyof PersonalEvaluationData, criterion, "cadet", value)
                        }
                      >
                        <SelectTrigger
                          className={`w-20 mx-auto ${getScoreColor(evaluationData[category as keyof PersonalEvaluationData][criterion]?.cadet)}`}
                        >
                          <SelectValue placeholder="צוער" />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 5, 6, 7, 8, 9, 10].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold text-right">ממוצע</TableCell>
                  <TableCell className={`text-center font-bold ${getScoreColor(averages[category]?.commander)}`}>
                    {averages[category]?.commander?.toFixed(2) || "-"}
                  </TableCell>
                  <TableCell className={`text-center font-bold ${getScoreColor(averages[category]?.cadet)}`}>
                    {averages[category]?.cadet?.toFixed(2) || "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">ממוצע כללי</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-right">ממוצע כללי</TableCell>
                <TableCell className={`text-center font-bold ${getScoreColor(overallAverage.commander)}`}>
                  {overallAverage.commander?.toFixed(2) || "-"}
                </TableCell>
                <TableCell className={`text-center font-bold ${getScoreColor(overallAverage.cadet)}`}>
                  {overallAverage.cadet?.toFixed(2) || "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}


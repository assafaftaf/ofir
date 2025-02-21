"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronUp, ChevronDown, Search } from "lucide-react"
import { useCadetContext, type Cadet } from "../contexts/CadetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SortField = "characterOfficership" | "professional" | "weighted"
type SortOrder = "asc" | "desc"

const convertSimulationScore = (score: number): number => {
  const conversionTable: { [key: number]: number } = {
    4: 50,
    5: 60,
    6: 70,
    7: 80,
    8: 90,
    9: 95,
    10: 100,
  }
  return conversionTable[score] || score
}

const calculateProfessionalScore = (cadet: Cadet) => {
  const practicalScores = cadet.scores
    .filter((score) => score.type === "practical")
    .map((score) => convertSimulationScore(score.value))

  return practicalScores.length > 0
    ? practicalScores.reduce((sum, score) => sum + score, 0) / practicalScores.length
    : 0
}

const calculateCharacterOfficershipScore = (cadet: Cadet) => {
  const { character, officership } = cadet.personalEvaluation
  const scores = [...Object.values(character), ...Object.values(officership)]
    .map((item) => item.commander)
    .filter((score): score is number => score !== null)

  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
}

const calculateWeightedScore = (cadet: Cadet) => {
  const professionalScore = calculateProfessionalScore(cadet)
  const characterOfficershipScore = calculateCharacterOfficershipScore(cadet)
  return (professionalScore + characterOfficershipScore) / 2
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

export default function ProgressTrackingScreen({ onBack }: { onBack: () => void }) {
  const { cadets } = useCadetContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("weighted")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const sortedCadets = useMemo(() => {
    return [...cadets].sort((a, b) => {
      let aValue, bValue

      if (sortField === "characterOfficership") {
        aValue = calculateCharacterOfficershipScore(a)
        bValue = calculateCharacterOfficershipScore(b)
      } else if (sortField === "professional") {
        aValue = calculateProfessionalScore(a)
        bValue = calculateProfessionalScore(b)
      } else {
        aValue = calculateWeightedScore(a)
        bValue = calculateWeightedScore(b)
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })
  }, [cadets, sortField, sortOrder])

  const filteredCadets = useMemo(() => {
    return sortedCadets.filter(
      (cadet) =>
        cadet.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || cadet.personalNumber.includes(searchTerm),
    )
  }, [sortedCadets, searchTerm])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const renderTable = (field: SortField) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">שם הצוער</TableHead>
          <TableHead>
            ציון
            <Button variant="ghost" onClick={() => handleSort(field)}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>הערות</TableHead>
          <TableHead>מגמה</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCadets.map((cadet) => {
          const professionalScore = calculateProfessionalScore(cadet)
          const characterOfficershipScore = calculateCharacterOfficershipScore(cadet)
          const weightedScore = calculateWeightedScore(cadet)

          let score
          if (field === "characterOfficership") {
            score = characterOfficershipScore
          } else if (field === "professional") {
            score = professionalScore
          } else {
            score = weightedScore
          }

          return (
            <TableRow key={cadet.id}>
              <TableCell className="font-medium">{cadet.fullName}</TableCell>
              <TableCell className={getScoreColor(score)}>{score.toFixed(2)}</TableCell>
              <TableCell>
                מקצועי: {professionalScore.toFixed(2)}, דמותי-קצינותי: {characterOfficershipScore.toFixed(2)}
              </TableCell>
              <TableCell>
                {Math.random() > 0.5 ? (
                  <ChevronUp className="text-green-500" />
                ) : (
                  <ChevronDown className="text-red-500" />
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-8 text-center">דירוג הצוערים - מעקב התקדמות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <Button onClick={onBack}>חזרה</Button>
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              <Input
                type="text"
                placeholder="חיפוש לפי שם או מספר אישי"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
          <Tabs defaultValue="weighted">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="characterOfficership">דמותי - קצינותי</TabsTrigger>
              <TabsTrigger value="professional">מקצועי</TabsTrigger>
              <TabsTrigger value="weighted">משוקלל</TabsTrigger>
            </TabsList>
            <TabsContent value="characterOfficership">{renderTable("characterOfficership")}</TabsContent>
            <TabsContent value="professional">{renderTable("professional")}</TabsContent>
            <TabsContent value="weighted">{renderTable("weighted")}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


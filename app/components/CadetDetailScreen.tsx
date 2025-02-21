"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useCadetContext, type Cadet, type Score, type TheoreticalExam } from "../contexts/CadetContext"
import ScoreInput from "./ScoreInput"
import TheoreticalExams from "./TheoreticalExams"
import ReferenceEntries from "./ReferenceEntries"
import PersonalEvaluation from "./PersonalEvaluation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OfficershipTab from "./OfficershipTab"
import ImageUpload from "./ImageUpload"

interface CadetDetailScreenProps {
  cadet: Cadet
  onBack: () => void
}

const seriesColors = {
  traffic: "#3182CE",
  defense: "#ED8936",
  maneuver: "#718096",
  combat: "#48BB78",
}

const seriesNames = {
  traffic: "תעבורה",
  defense: 'הגנ"א',
  maneuver: 'מענ"ש',
  combat: "קרבות",
}

const subSeriesColors = {
  introductory: { bg: "#E6F6FE", text: "#2C5282" },
  basic: { bg: "#E8F5E9", text: "#2F855A" },
  advanced: { bg: "#FFF3E0", text: "#C05621" },
}

const subSeriesLabels = {
  introductory: "מבואות (1-3)",
  basic: "בסיסי (4-8)",
  advanced: "מתקדם (9-18)",
}

const getSimulationPhase = (simulationNumber: number) => {
  if (simulationNumber <= 3) return "introductory"
  if (simulationNumber <= 8) return "basic"
  return "advanced"
}

interface CustomXAxisTickProps {
  x?: number
  y?: number
  payload?: {
    value: number
  }
}

const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  if (!x || !y || !payload?.value) return null

  const simulationNumber = payload.value
  const phase = getSimulationPhase(simulationNumber)
  const backgroundColor = subSeriesColors[phase].bg

  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-10} y={0} width={20} height={20} fill={backgroundColor} />
      <text x={0} y={14} textAnchor="middle" fill="#666" fontSize="10">
        {simulationNumber}
      </text>
    </g>
  )
}

export default function CadetDetailScreen({ cadet: initialCadet, onBack }: CadetDetailScreenProps) {
  const [cadet, setCadet] = useState<Cadet | null>(initialCadet)
  const [referenceDate, setReferenceDate] = useState("")
  const [referenceDescription, setReferenceDescription] = useState("")
  const [localScores, setLocalScores] = useState<Score[]>(cadet?.scores || [])
  const { addScore, updateTheoreticalExams, addReferenceEntry, updateCadetImage } = useCadetContext()

  const handleScoreSubmit = useCallback(
    (newScore: Score) => {
      if (cadet) {
        addScore(cadet.id, newScore)
        setLocalScores((prevScores) => [...prevScores, newScore])
      }
    },
    [addScore, cadet],
  )

  const handleTheoreticalExamsUpdate = useCallback(
    (exams: TheoreticalExam[]) => {
      if (cadet) {
        updateTheoreticalExams(cadet.id, exams)
      }
    },
    [updateTheoreticalExams, cadet],
  )

  const handleReferenceSave = () => {
    if (cadet && referenceDate && referenceDescription.trim()) {
      const newEntry = {
        date: referenceDate,
        cadetName: cadet.fullName,
        description: referenceDescription,
        treatment: "",
      }
      addReferenceEntry(cadet.id, newEntry)
      setReferenceDate("")
      setReferenceDescription("")
    }
  }

  const formatScoreData = useCallback((scores: Score[]) => {
    const formattedData: { [key: number]: any } = {}
    for (let i = 1; i <= 18; i++) {
      formattedData[i] = {
        simulationNumber: i,
        phase: getSimulationPhase(i),
      }
    }

    scores
      .filter((score) => score.type === "practical")
      .forEach((score) => {
        if (score.simulationNumber) {
          formattedData[score.simulationNumber] = {
            ...formattedData[score.simulationNumber],
            [score.series]: score.value,
          }
        }
      })

    return Object.values(formattedData)
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-xs">
          <p className="font-bold">סימולציה {label}</p>
          <p className="text-gray-600">{subSeriesLabels[payload[0]?.payload.phase as keyof typeof subSeriesLabels]}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.value !== undefined) {
              return (
                <p key={index} style={{ color: entry.color }}>
                  {seriesNames[entry.dataKey as keyof typeof seriesNames]}: {entry.value}
                </p>
              )
            }
            return null
          })}
        </div>
      )
    }
    return null
  }

  useEffect(() => {
    const handleOfficershipNameUpdate = (event: CustomEvent) => {
      const updatedName = event.detail
      setCadet((prevCadet) => {
        if (prevCadet) {
          return { ...prevCadet, officership: { ...prevCadet.officership, name: updatedName } }
        }
        return prevCadet
      })
    }

    window.addEventListener("officershipNameUpdated", handleOfficershipNameUpdate as EventListener)

    return () => {
      window.removeEventListener("officershipNameUpdated", handleOfficershipNameUpdate as EventListener)
    }
  }, [])

  const handleImageUpload = (imageUrl: string) => {
    if (cadet) {
      updateCadetImage(cadet.id, imageUrl)
      setCadet({ ...cadet, imageUrl })
    }
  }

  const handleImageDelete = () => {
    if (cadet) {
      updateCadetImage(cadet.id, "")
      setCadet({ ...cadet, imageUrl: "" })
    }
  }

  if (!cadet) return null

  return (
    <div className="container mx-auto px-4 py-8 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-center">פרופיל צוער: {cadet.fullName}</h1>
      <ScrollArea className="w-full [&_[data-radix-scroll-area-viewport]]:!block rtl-support" dir="rtl">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="inline-flex w-full min-w-max">
            <TabsTrigger value="practical">ציונים מעשיים</TabsTrigger>
            <TabsTrigger value="theoretical">ציונים עיוניים</TabsTrigger>
            <TabsTrigger value="references">מראה מקום</TabsTrigger>
            <TabsTrigger value="evaluation">חוו"ד אישי</TabsTrigger>
            <TabsTrigger value="officership">קצינות</TabsTrigger>
            <TabsTrigger value="personal">פרטים אישיים</TabsTrigger>
          </TabsList>
          <TabsContent value="officership">
            <OfficershipTab cadetId={cadet.id} />
          </TabsContent>
          <TabsContent value="evaluation">
            <PersonalEvaluation cadetId={cadet.id} />
          </TabsContent>
          <TabsContent value="references">
            <ReferenceEntries cadetId={cadet.id} />
          </TabsContent>
          <TabsContent value="theoretical">
            <TheoreticalExams exams={cadet.theoreticalExams} onUpdate={handleTheoreticalExamsUpdate} />
          </TabsContent>
          <TabsContent value="practical">
            <Card>
              <CardHeader>
                <CardTitle>הוספת ציון מעשי</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreInput onScoreSubmit={handleScoreSubmit} />
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>גרף ביצועים מעשיים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatScoreData(localScores)} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="simulationNumber"
                        tick={<CustomXAxisTick />}
                        type="number"
                        domain={[1, 18]}
                        height={40}
                      />
                      <YAxis type="number" domain={[4, 10]} ticks={[4, 5, 6, 7, 8, 9, 10]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" align="right" height={36} />
                      <ReferenceLine
                        y={6}
                        stroke="#718096"
                        strokeDasharray="3 3"
                        label={{ value: "ציון עובר", position: "right", fontSize: 10 }}
                      />
                      {Object.entries(seriesColors).map(([series, color]) => (
                        <Line
                          key={series}
                          type="monotone"
                          dataKey={series}
                          name={seriesNames[series as keyof typeof seriesNames]}
                          stroke={color}
                          strokeWidth={2}
                          dot={{ stroke: color, strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 5 }}
                          connectNulls
                        />
                      ))}
                      <ReferenceArea
                        x1={1}
                        x2={3}
                        y1={4}
                        y2={10}
                        fill={subSeriesColors.introductory.bg}
                        fillOpacity={0.3}
                      />
                      <ReferenceArea x1={4} x2={8} y1={4} y2={10} fill={subSeriesColors.basic.bg} fillOpacity={0.3} />
                      <ReferenceArea
                        x1={9}
                        x2={18}
                        y1={4}
                        y2={10}
                        fill={subSeriesColors.advanced.bg}
                        fillOpacity={0.3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-2 text-sm font-semibold">
                  {Object.entries(subSeriesLabels).map(([phase, label]) => (
                    <div
                      key={phase}
                      className="flex-1 text-center"
                      style={{
                        color: subSeriesColors[phase as keyof typeof subSeriesColors].text,
                        borderBottom: `2px solid ${subSeriesColors[phase as keyof typeof subSeriesColors].text}`,
                        paddingBottom: "4px",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="personal">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <Card>
                <CardHeader>
                  <CardTitle>פרטים אישיים</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    currentImageUrl={cadet.imageUrl || "/placeholder.svg?height=200&width=200"}
                    onImageUpload={handleImageUpload}
                    onImageDelete={handleImageDelete}
                  />
                  <div className="mt-4">
                    <p className="mb-2">
                      <strong>שם:</strong> {cadet.fullName}
                    </p>
                    <p className="mb-2">
                      <strong>גיל:</strong> {cadet.age}
                    </p>
                    <p className="mb-2">
                      <strong>מקום מגורים:</strong> {cadet.location}
                    </p>
                    <p className="mb-2">
                      <strong>מספר אישי:</strong> {cadet.personalNumber}
                    </p>
                    <p className="mb-2">
                      <strong>שם הקצינות:</strong> {cadet.officership.name || "לא הוגדר"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>מראה מקום</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="referenceDate">תאריך האירוע</Label>
                      <Input
                        id="referenceDate"
                        type="date"
                        value={referenceDate}
                        onChange={(e) => setReferenceDate(e.target.value)}
                        className="mb-2 text-right"
                        style={{ direction: "rtl" }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="referenceDescription">תיאור האירוע</Label>
                      <Textarea
                        id="referenceDescription"
                        value={referenceDescription}
                        onChange={(e) => setReferenceDescription(e.target.value)}
                        placeholder="הזן תיאור האירוע"
                        className="mb-2 text-right"
                        style={{ direction: "rtl" }}
                      />
                    </div>
                    <Button onClick={handleReferenceSave}>שמור מראה מקום</Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mt-8 flex justify-center">
        <Button onClick={onBack}>חזרה לרשימת הצוערים</Button>
      </div>
    </div>
  )
}


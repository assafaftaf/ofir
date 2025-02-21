"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Score } from "../contexts/CadetContext"

interface ScoreInputProps {
  onScoreSubmit: (score: Score) => void
}

export default function ScoreInput({ onScoreSubmit }: ScoreInputProps) {
  const [series, setSeries] = useState<"traffic" | "defense" | "maneuver" | "combat">("traffic")
  const [value, setValue] = useState("")
  const [simulationNumber, setSimulationNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newScore: Score = {
      type: "practical",
      series,
      value: Number(value),
      simulationNumber: Number(simulationNumber),
      date: new Date().toISOString(),
    }
    onScoreSubmit(newScore)
    setValue("")
    setSimulationNumber("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>סדרה</Label>
        <Select
          value={series}
          onValueChange={(value: "traffic" | "defense" | "maneuver" | "combat") => setSeries(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="בחר סדרה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="traffic">תעבורה</SelectItem>
            <SelectItem value="defense">הגנ"א</SelectItem>
            <SelectItem value="maneuver">מענ"ש</SelectItem>
            <SelectItem value="combat">קרבות</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>מספר סימולציה</Label>
        <Input
          type="number"
          value={simulationNumber}
          onChange={(e) => setSimulationNumber(e.target.value)}
          min={1}
          max={18}
          required
        />
      </div>
      <div>
        <Label>ציון</Label>
        <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} min={4} max={10} required />
      </div>
      <Button type="submit">הוסף ציון</Button>
    </form>
  )
}


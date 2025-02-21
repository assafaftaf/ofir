"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "ינואר", score: 80 },
  { month: "פברואר", score: 82 },
  { month: "מרץ", score: 85 },
  { month: "אפריל", score: 84 },
  { month: "מאי", score: 87 },
  { month: "יוני", score: 89 },
]

export default function ImprovementGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>גרף שיפור כללי</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


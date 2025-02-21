"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { OfficershipTask } from "../contexts/CadetContext"

interface OfficershipChartProps {
  tasks: OfficershipTask[]
}

interface ChartData {
  name: string
  inProgress: number
  completed: number
  overdue: number
}

const OfficershipChart: React.FC<OfficershipChartProps> = ({ tasks }) => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [totalTasks, setTotalTasks] = useState(0)

  useEffect(() => {
    const now = new Date()
    const data: ChartData = {
      name: "משימות",
      inProgress: 0,
      completed: 0,
      overdue: 0,
    }

    tasks.forEach((task) => {
      if (task.completed) {
        data.completed++
      } else if (new Date(task.dueDate) < now) {
        data.overdue++
      } else {
        data.inProgress++
      }
    })

    setChartData([data])
    setTotalTasks(tasks.length)
  }, [tasks])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold mb-2">פירוט משימות:</p>
          <p className="text-blue-600">בביצוע: {data.inProgress}</p>
          <p className="text-green-600">הושלמו: {data.completed}</p>
          <p className="text-red-600">חורגות: {data.overdue}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="text-right font-bold text-lg">סך כל המשימות בתכנית: {totalTasks}</div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="inProgress" fill="#3B82F6" name="בביצוע" stackId="a" animationDuration={1000} />
            <Bar dataKey="completed" fill="#10B981" name="הושלמו" stackId="a" animationDuration={1000} />
            <Bar dataKey="overdue" fill="#EF4444" name="חורגות" stackId="a" animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-4 space-x-reverse text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-2"></div>
          <span>משימות בביצוע</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>משימות שבוצעו</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>משימות חורגות</span>
        </div>
      </div>
    </div>
  )
}

export default OfficershipChart


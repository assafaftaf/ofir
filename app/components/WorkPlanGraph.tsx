"use client"

import type React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  name: string
  status: "completed" | "inProgress" | "overdue" | "recurring"
  dueDate: string
  isRecurring: boolean
}

interface WorkPlanGraphProps {
  tasks: Task[]
  onMarkCompleted: (taskId: string) => void
}

const COLORS = {
  completed: "#10B981",
  inProgress: "#3B82F6",
  overdue: "#EF4444",
  recurring: "#8B5CF6",
}

const WorkPlanGraph: React.FC<WorkPlanGraphProps> = ({ tasks, onMarkCompleted }) => {
  const getStatusCounts = () => {
    const counts = { completed: 0, inProgress: 0, overdue: 0, recurring: 0 }
    tasks.forEach((task) => {
      if (task.isRecurring) {
        counts.recurring++
      } else {
        counts[task.status]++
      }
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress").length
  const overdueTasks = tasks.filter((task) => task.status === "overdue").length
  const recurringTasks = tasks.filter((task) => task.isRecurring).length

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const labels = {
        completed: "בוצעו",
        inProgress: "בביצוע",
        overdue: "חורגות",
        recurring: "שוטפות",
      }
      return (
        <div className="bg-white p-4 border rounded shadow-lg text-right" dir="rtl">
          <p className="font-bold mb-2">{labels[data.name as keyof typeof labels]}</p>
          <p>מספר משימות: {data.value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">ניתוח תכנית עבודה</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-8" dir="rtl">
          <div className="w-full max-w-md">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusCounts()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getStatusCounts().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                  {totalTasks}
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 space-x-reverse mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 ml-2"></div>
                <span>בוצעו</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 ml-2"></div>
                <span>בביצוע</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 ml-2"></div>
                <span>חורגות</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 ml-2"></div>
                <span>שוטפות</span>
              </div>
            </div>
          </div>
          <div className="w-full space-y-4 text-right">
            <h3 className="text-lg font-semibold">סיכום משימות:</h3>
            <p>
              סך כל המשימות: <span className="font-bold">{totalTasks}</span>
            </p>
            <p>
              משימות שבוצעו: <span className="font-bold text-green-600">{completedTasks}</span>
            </p>
            <p>
              משימות בביצוע: <span className="font-bold text-blue-600">{inProgressTasks}</span>
            </p>
            <p>
              משימות חורגות: <span className="font-bold text-red-600">{overdueTasks}</span>
            </p>
            <p>
              משימות שוטפות: <span className="font-bold text-purple-600">{recurringTasks}</span>
            </p>
          </div>
          <div className="w-full space-y-4 text-right">
            <h3 className="text-lg font-semibold">רשימת משימות:</h3>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center border-b pb-2">
                  <Button
                    onClick={() => onMarkCompleted(task.id)}
                    disabled={task.status === "completed"}
                    variant={task.status === "completed" ? "outline" : "default"}
                  >
                    {task.status === "completed" ? "בוצע" : "סמן כבוצע"}
                  </Button>
                  <div className="text-right">
                    <p className="font-semibold">{task.name}</p>
                    <p className="text-sm text-gray-600">
                      {task.isRecurring ? "משימה שוטפת" : `תאריך יעד: ${task.dueDate}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkPlanGraph


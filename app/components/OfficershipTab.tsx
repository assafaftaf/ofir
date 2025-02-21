"use client"

import { useState, useEffect } from "react"
import { useCadetContext } from "../contexts/CadetContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSpring, animated } from "react-spring"
import { Checkbox } from "@/components/ui/checkbox"
import WorkPlanGraph from "./WorkPlanGraph"

interface OfficershipTabProps {
  cadetId: string
}

export default function OfficershipTab({ cadetId }: OfficershipTabProps) {
  const { cadets, updateOfficershipName, addOfficershipTask, updateOfficershipTask } = useCadetContext()
  const cadet = cadets.find((c) => c.id === cadetId)

  const [officershipName, setOfficershipName] = useState(cadet?.officership.name || "")
  const [isEditing, setIsEditing] = useState(!cadet?.officership.name)
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)

  const [nameProps, nameApi] = useSpring(() => ({
    opacity: 0,
    y: 20,
  }))

  useEffect(() => {
    if (cadet) {
      setOfficershipName(cadet.officership.name)
      setIsEditing(!cadet.officership.name)
    }
  }, [cadet])

  useEffect(() => {
    if (!isEditing && officershipName) {
      nameApi.start({
        opacity: 1,
        y: 0,
        from: { opacity: 0, y: 20 },
        config: { tension: 300, friction: 10 },
      })
    }
  }, [isEditing, officershipName, nameApi])

  if (!cadet) return null

  const handleSaveOfficershipName = () => {
    updateOfficershipName(cadetId, officershipName)
    setIsEditing(false)
    const event = new CustomEvent("officershipNameUpdated", { detail: officershipName })
    window.dispatchEvent(event)
  }

  const handleEditOfficershipName = () => {
    setIsEditing(true)
  }

  const handleAddTask = () => {
    if (newTaskDescription && (newTaskDueDate || isRecurring)) {
      addOfficershipTask(cadetId, {
        description: newTaskDescription,
        dueDate: isRecurring ? "" : newTaskDueDate,
        completed: false,
        isRecurring: isRecurring,
      })
      setNewTaskDescription("")
      setNewTaskDueDate("")
      setIsRecurring(false)
    }
  }

  const handleToggleTaskCompletion = (taskId: string) => {
    const task = cadet.officership.tasks.find((t) => t.id === taskId)
    if (task) {
      updateOfficershipTask(cadetId, taskId, { ...task, completed: true })
    }
  }

  const sortedTasks = [...cadet.officership.tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )

  const formattedTasks = sortedTasks.map((task) => ({
    id: task.id,
    name: task.description,
    status: task.completed
      ? "completed"
      : task.isRecurring
        ? "recurring"
        : new Date(task.dueDate) < new Date()
          ? "overdue"
          : "inProgress",
    dueDate: task.dueDate,
    isRecurring: task.isRecurring,
  }))

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>תכנית עבודה קצינותית</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <div>
                <Label htmlFor="officershipName">שם הקצינות</Label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Input
                    id="officershipName"
                    value={officershipName}
                    onChange={(e) => setOfficershipName(e.target.value)}
                    placeholder="הזן שם הקצינות"
                    className="text-right"
                    style={{ direction: "rtl" }}
                  />
                  <Button onClick={handleSaveOfficershipName}>שמור</Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <animated.h2 style={nameProps} className="text-2xl font-bold text-gray-700 mb-4">
                  קצינות: {officershipName}
                </animated.h2>
                <Button onClick={handleEditOfficershipName}>שנה קצינות</Button>
              </div>
            )}
            <WorkPlanGraph tasks={formattedTasks} onMarkCompleted={handleToggleTaskCompletion} />
            <div>
              <Label htmlFor="newTaskDescription">תיאור המשימה</Label>
              <Input
                id="newTaskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="הזן תיאור המשימה"
                className="text-right"
                style={{ direction: "rtl" }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="isRecurring">משימה שוטפת</Label>
            </div>
            {!isRecurring && (
              <div>
                <Label htmlFor="newTaskDueDate">תאריך יעד</Label>
                <Input
                  id="newTaskDueDate"
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="text-right"
                  style={{ direction: "rtl" }}
                />
              </div>
            )}
            <Button onClick={handleAddTask}>הוסף משימה</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


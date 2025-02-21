"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCadetContext, type ReferenceEntry } from "../contexts/CadetContext"

interface ReferenceEntriesProps {
  cadetId: string
}

export default function ReferenceEntries({ cadetId }: ReferenceEntriesProps) {
  const { cadets, updateReferenceEntry } = useCadetContext()
  const cadet = cadets.find((c) => c.id === cadetId)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedTreatment, setEditedTreatment] = useState("")

  if (!cadet) return null

  const handleEditClick = (entry: ReferenceEntry) => {
    setEditingId(entry.id)
    setEditedTreatment(entry.treatment)
  }

  const handleSaveClick = (entry: ReferenceEntry) => {
    updateReferenceEntry(cadetId, entry.id, { ...entry, treatment: editedTreatment })
    setEditingId(null)
  }

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {cadet.referenceEntries.map((entry, index) => (
        <Card key={entry.id}>
          <CardHeader>
            <CardTitle>מראה מקום #{index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              <strong>תאריך האירוע:</strong> {entry.date}
            </p>
            <p className="mb-2">
              <strong>שם הצוער:</strong> {entry.cadetName}
            </p>
            <p className="mb-2">
              <strong>תיאור האירוע:</strong> {entry.description}
            </p>
            {editingId === entry.id ? (
              <>
                <Textarea
                  value={editedTreatment}
                  onChange={(e) => setEditedTreatment(e.target.value)}
                  placeholder="הזן טיפול"
                  className="mt-2 text-right"
                />
                <Button onClick={() => handleSaveClick(entry)} className="mt-2">
                  שמור
                </Button>
              </>
            ) : (
              <>
                <p className="mb-2">
                  <strong>טיפול:</strong> {entry.treatment || "לא הוזן"}
                </p>
                <Button onClick={() => handleEditClick(entry)} className="mt-2">
                  ערוך טיפול
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


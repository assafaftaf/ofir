"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCadetContext } from "../contexts/CadetContext"

export default function AddCadetScreen({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    location: "",
    personalNumber: "",
  })
  const { toast } = useToast()
  const { addCadet } = useCadetContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(formData).every((value) => value)) {
      addCadet({
        fullName: formData.fullName,
        age: Number(formData.age),
        location: formData.location,
        personalNumber: formData.personalNumber,
      })
      toast({
        title: "הצוער נוסף בהצלחה!",
        description: "פרטי הצוער נשמרו במערכת.",
      })
      onBack()
    } else {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">הוספת צוער חדש</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="fullName">שם מלא</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="age">גיל</Label>
          <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="location">מקום מגורים</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="personalNumber">מספר אישי</Label>
          <Input
            id="personalNumber"
            name="personalNumber"
            value={formData.personalNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-between">
          <Button type="submit">אישור</Button>
          <Button type="button" variant="outline" onClick={onBack}>
            חזרה
          </Button>
        </div>
      </form>
    </div>
  )
}


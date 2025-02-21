"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2 } from "lucide-react"
import { useCadetContext } from "../contexts/CadetContext"

interface CadetListScreenProps {
  onBack: () => void
  onSelectCadet: (cadet: {
    id: string
    fullName: string
    age: number
    location: string
    personalNumber: string
  }) => void
  onEditCadet: (cadet: { id: string; fullName: string; age: number; location: string; personalNumber: string }) => void
}

export default function CadetListScreen({ onBack, onSelectCadet, onEditCadet }: CadetListScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { cadets, deleteCadet } = useCadetContext()

  const filteredCadets = cadets.filter(
    (cadet) =>
      cadet.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || cadet.personalNumber.includes(searchTerm),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">רשימת צוערים</h1>
      <div className="mb-4 flex">
        <Input
          type="text"
          placeholder="חיפוש לפי שם או מספר אישי"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm ml-auto"
        />
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {filteredCadets.length === 0 ? (
        <p className="text-center text-gray-500">אין צוערים ברשימה כרגע.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם מלא</TableHead>
              <TableHead>גיל</TableHead>
              <TableHead>מקום מגורים</TableHead>
              <TableHead>מספר אישי</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCadets.map((cadet) => (
              <TableRow key={cadet.id}>
                <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => onSelectCadet(cadet)}>
                  {cadet.fullName}
                </TableCell>
                <TableCell>{cadet.age}</TableCell>
                <TableCell>{cadet.location}</TableCell>
                <TableCell>{cadet.personalNumber}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEditCadet(cadet)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteCadet(cadet.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="mt-4">
        <Button onClick={onBack}>חזרה</Button>
      </div>
    </div>
  )
}


"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

export type Score = {
  type: "practical" | "theoretical"
  series: "traffic" | "defense" | "maneuver" | "combat"
  subSeries?: "introductory" | "basic" | "advanced"
  value: number
  simulationNumber?: number
  date: string
}

export type TheoreticalExam = {
  category: string
  exams: Array<{
    name: string
    scores: Array<number | null>
  }>
}

export type ReferenceEntry = {
  id: string
  date: string
  cadetName: string
  description: string
  treatment: string
}

export type PersonalEvaluationData = {
  character: { [key: string]: { commander: number | null; cadet: number | null } }
  officership: { [key: string]: { commander: number | null; cadet: number | null } }
  professionalSkills: { [key: string]: { commander: number | null; cadet: number | null } }
}

export type OfficershipTask = {
  id: string
  description: string
  dueDate: string
  completed: boolean
  isRecurring: boolean
}

export type Cadet = {
  id: string
  fullName: string
  age: number
  location: string
  personalNumber: string
  imageUrl: string
  scores: Score[]
  theoreticalExams: TheoreticalExam[]
  referenceEntries: ReferenceEntry[]
  personalEvaluation: PersonalEvaluationData
  officership: {
    name: string
    tasks: OfficershipTask[]
  }
}

type CadetContextType = {
  cadets: Cadet[]
  addCadet: (
    cadet: Omit<
      Cadet,
      "id" | "scores" | "theoreticalExams" | "referenceEntries" | "personalEvaluation" | "officership"
    >,
  ) => void
  updateCadet: (id: string, cadet: Omit<Cadet, "id">) => void
  deleteCadet: (id: string) => void
  addScore: (cadetId: string, score: Score) => void
  updateTheoreticalExams: (cadetId: string, exams: TheoreticalExam[]) => void
  addReferenceEntry: (cadetId: string, entry: Omit<ReferenceEntry, "id">) => void
  updateReferenceEntry: (cadetId: string, entryId: string, updatedEntry: ReferenceEntry) => void
  updatePersonalEvaluation: (cadetId: string, evaluationData: PersonalEvaluationData) => void
  calculateProfessionalAverage: (cadetId: string) => number
  calculateCharacterOfficershipAverage: (cadetId: string) => number
  updateOfficershipName: (cadetId: string, name: string) => void
  addOfficershipTask: (cadetId: string, task: Omit<OfficershipTask, "id">) => void
  updateOfficershipTask: (cadetId: string, taskId: string, updatedTask: OfficershipTask) => void
  updateCadetImage: (id: string, imageUrl: string) => void
}

const CadetContext = createContext<CadetContextType | undefined>(undefined)

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

const getSubSeries = (simulationNumber: number): "introductory" | "basic" | "advanced" => {
  if (simulationNumber <= 3) return "introductory"
  if (simulationNumber <= 8) return "basic"
  return "advanced"
}

export const CadetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cadets, setCadets] = useState<Cadet[]>([])

  useEffect(() => {
    const savedCadets = localStorage.getItem("cadets")
    if (savedCadets) {
      setCadets(JSON.parse(savedCadets))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cadets", JSON.stringify(cadets))
  }, [cadets])

  const addCadet = (
    cadet: Omit<
      Cadet,
      "id" | "scores" | "theoreticalExams" | "referenceEntries" | "personalEvaluation" | "officership"
    >,
  ) => {
    const newCadet = {
      ...cadet,
      id: Date.now().toString(),
      scores: [],
      theoreticalExams: [],
      referenceEntries: [],
      personalEvaluation: {
        character: {},
        officership: {},
        professionalSkills: {},
      },
      officership: {
        name: "",
        tasks: [],
      },
      imageUrl: "",
    }
    setCadets((prevCadets) => [...prevCadets, newCadet])
  }

  const updateCadet = (id: string, updatedCadet: Omit<Cadet, "id">) => {
    setCadets((prevCadets) => prevCadets.map((cadet) => (cadet.id === id ? { ...updatedCadet, id } : cadet)))
  }

  const deleteCadet = (id: string) => {
    setCadets((prevCadets) => prevCadets.filter((cadet) => cadet.id !== id))
  }

  const addScore = (cadetId: string, score: Score) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) => (cadet.id === cadetId ? { ...cadet, scores: [...cadet.scores, score] } : cadet)),
    )
  }

  const updateTheoreticalExams = (cadetId: string, exams: TheoreticalExam[]) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) => (cadet.id === cadetId ? { ...cadet, theoreticalExams: exams } : cadet)),
    )
  }

  const addReferenceEntry = (cadetId: string, entry: Omit<ReferenceEntry, "id">) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) =>
        cadet.id === cadetId
          ? { ...cadet, referenceEntries: [...cadet.referenceEntries, { ...entry, id: Date.now().toString() }] }
          : cadet,
      ),
    )
  }

  const updateReferenceEntry = (cadetId: string, entryId: string, updatedEntry: ReferenceEntry) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) =>
        cadet.id === cadetId
          ? {
              ...cadet,
              referenceEntries: cadet.referenceEntries.map((entry) => (entry.id === entryId ? updatedEntry : entry)),
            }
          : cadet,
      ),
    )
  }

  const updatePersonalEvaluation = (cadetId: string, evaluationData: PersonalEvaluationData) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) => (cadet.id === cadetId ? { ...cadet, personalEvaluation: evaluationData } : cadet)),
    )
  }

  const calculateProfessionalAverage = (cadetId: string): number => {
    const cadet = cadets.find((c) => c.id === cadetId)
    if (!cadet) return 0

    const weights = {
      introductory: { exams: 0.1, simulations: 0.15 },
      basic: { exams: 0.2, simulations: 0.25 },
      advanced: { exams: 0.3, simulations: 0.4 },
    }

    let totalWeight = 0
    let weightedSum = 0

    // Calculate for simulations
    cadet.scores
      .filter((score) => score.type === "practical" && score.simulationNumber !== undefined)
      .forEach((score) => {
        const convertedScore = convertSimulationScore(score.value)
        const subSeries = getSubSeries(score.simulationNumber!)
        const weight = weights[subSeries].simulations
        weightedSum += convertedScore * weight
        totalWeight += weight
      })

    // Calculate for theoretical exams
    cadet.theoreticalExams.forEach((category) => {
      category.exams.forEach((exam) => {
        const maxScore = Math.max(...(exam.scores.filter((score) => score !== null) as number[]))
        if (maxScore !== undefined) {
          let weight
          if (category.category.includes("מבואות")) {
            weight = weights.introductory.exams
          } else if (category.category.includes("בסיסי")) {
            weight = weights.basic.exams
          } else {
            weight = weights.advanced.exams
          }
          weightedSum += maxScore * weight
          totalWeight += weight
        }
      })
    })

    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  const calculateCharacterOfficershipAverage = (cadetId: string): number => {
    const cadet = cadets.find((c) => c.id === cadetId)
    if (!cadet) return 0

    const { character, officership } = cadet.personalEvaluation
    const relevantScores = [...Object.values(character), ...Object.values(officership)]
      .map((item) => item.commander)
      .filter((score): score is number => score !== null)

    return relevantScores.length > 0 ? relevantScores.reduce((sum, score) => sum + score, 0) / relevantScores.length : 0
  }

  const updateOfficershipName = (cadetId: string, name: string) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) =>
        cadet.id === cadetId ? { ...cadet, officership: { ...cadet.officership, name } } : cadet,
      ),
    )
  }

  const addOfficershipTask = (cadetId: string, task: Omit<OfficershipTask, "id">) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) =>
        cadet.id === cadetId
          ? {
              ...cadet,
              officership: {
                ...cadet.officership,
                tasks: [...cadet.officership.tasks, { ...task, id: Date.now().toString() }],
              },
            }
          : cadet,
      ),
    )
  }

  const updateOfficershipTask = (cadetId: string, taskId: string, updatedTask: OfficershipTask) => {
    setCadets((prevCadets) =>
      prevCadets.map((cadet) =>
        cadet.id === cadetId
          ? {
              ...cadet,
              officership: {
                ...cadet.officership,
                tasks: cadet.officership.tasks.map((task) => (task.id === taskId ? updatedTask : task)),
              },
            }
          : cadet,
      ),
    )
  }

  const updateCadetImage = (id: string, imageUrl: string) => {
    setCadets((prevCadets) => prevCadets.map((cadet) => (cadet.id === id ? { ...cadet, imageUrl } : cadet)))
  }

  return (
    <CadetContext.Provider
      value={{
        cadets,
        addCadet,
        updateCadet,
        deleteCadet,
        addScore,
        updateTheoreticalExams,
        addReferenceEntry,
        updateReferenceEntry,
        updatePersonalEvaluation,
        calculateProfessionalAverage,
        calculateCharacterOfficershipAverage,
        updateOfficershipName,
        addOfficershipTask,
        updateOfficershipTask,
        updateCadetImage,
      }}
    >
      {children}
    </CadetContext.Provider>
  )
}

export const useCadetContext = () => {
  const context = useContext(CadetContext)
  if (context === undefined) {
    throw new Error("useCadetContext must be used within a CadetProvider")
  }
  return context
}


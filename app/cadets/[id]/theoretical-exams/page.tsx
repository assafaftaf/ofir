import { Suspense } from "react"
import TheoreticalExamsScreen from "@/app/components/TheoreticalExamsScreen"
import { CadetProvider } from "@/app/contexts/CadetContext"

export default function TheoreticalExamsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CadetProvider>
        <TheoreticalExamsClientWrapper id={params.id} />
      </CadetProvider>
    </Suspense>
  )
}
;("use client")

import { useCadetContext } from "@/app/contexts/CadetContext"

function TheoreticalExamsClientWrapper({ id }: { id: string }) {
  const { cadets } = useCadetContext()
  const cadet = cadets.find((c) => c.id === id)

  if (!cadet) {
    return <div>Cadet not found</div>
  }

  return <TheoreticalExamsScreen cadet={cadet} />
}


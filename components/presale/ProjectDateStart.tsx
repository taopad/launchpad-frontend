"use client"

import { formatTimestamp } from "@/lib/utils"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"

export function ProjectDateStart() {
    const project = useProjectStaticData()

    const timestamp = project.data?.startDate ?? 0n

    if (!project.isSuccess) {
        return <span></span>
    }

    return <span>{formatTimestamp(timestamp)}</span>
}

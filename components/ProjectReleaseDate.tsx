"use client"

import { useProjectStaticData } from "@/hooks/useProjectStaticData"
import { formatTimestamp } from "@/lib/utils"

export function ProjectReleaseDate() {
    const project = useProjectStaticData()

    const end = project.data?.endDate ?? 0n
    const delay = project.data?.releaseDelay ?? 0n
    const total = end + delay

    if (!project.isSuccess) {
        return <span></span>
    }

    return <span>{formatTimestamp(total)}</span>
}

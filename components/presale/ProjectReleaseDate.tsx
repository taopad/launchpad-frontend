"use client"

import { formatTimestamp } from "@/lib/utils"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"

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

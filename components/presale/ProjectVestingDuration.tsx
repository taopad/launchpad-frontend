"use client"

import { useProjectWatchData } from "@/hooks/useProjectWatchData"

export function ProjectVestingDuration() {
    const project = useProjectWatchData()

    const seconds = Number(project.data?.vestingDuration ?? 0n)
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    if (!project.isSuccess) {
        return <span></span>
    }

    return <span>{days}</span>
}

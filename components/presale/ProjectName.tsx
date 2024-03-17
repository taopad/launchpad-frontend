"use client"

import { useProjectStaticData } from "@/hooks/useProjectStaticData"

export function ProjectName() {
    const project = useProjectStaticData()

    const name = project.data?.name ?? ""

    if (!project.isSuccess) {
        return <span></span>
    }

    return <span>{name}</span>
}

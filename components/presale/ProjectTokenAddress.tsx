"use client"

import { Address } from "@/components/Address"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"

export function ProjectTokenAddress() {
    const project = useProjectStaticData()

    const token = project.data?.token ?? ""

    if (!project.isSuccess) {
        return <span></span>
    }

    return <Address>{token}</Address>
}

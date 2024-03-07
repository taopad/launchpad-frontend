"use client"

import { formatAmount } from "@/lib/utils"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"

export function ProjectWhitelistMinBalance() {
    const project = useProjectWatchData()

    const minBalance = project.data?.wlMinBalance ?? 0n

    if (!project.isSuccess) {
        return <span></span>
    }

    return <span>{formatAmount(minBalance, 18)}</span>
}

"use client"

import { formatEther } from "viem"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"

export function TokenEthPrice() {
    const project = useProjectWatchData()

    const price = project.data?.ethPrice ?? 0n

    if (!project.isSuccess) {
        return <span></span>
    }

    return formatEther(price)
}

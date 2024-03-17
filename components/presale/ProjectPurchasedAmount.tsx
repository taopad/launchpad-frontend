"use client"

import { formatUnits } from "viem"
import { useTokenData } from "@/hooks/useTokenData"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { formatAmount } from "@/lib/utils"

export function ProjectPurchasedAmount() {
    const token = useTokenData()
    const project = useProjectWatchData()

    const amount = project.data?.purchased ?? 0n
    const decimals = token.data?.decimals ?? 0

    if (!token.isSuccess || !project.isSuccess) {
        return <span></span>
    }

    return (
        <span title={formatUnits(amount, decimals)}>
            {formatAmount(amount, decimals)}
        </span>
    )
}

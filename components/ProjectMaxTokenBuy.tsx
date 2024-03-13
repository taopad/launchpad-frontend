"use client"

import { formatUnits } from "viem"
import { useTokenData } from "@/hooks/useTokenData"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"
import { formatAmount } from "@/lib/utils"

export function ProjectMaxTokenBuy() {
    const token = useTokenData()
    const project = useProjectStaticData()

    const maxTokenBuy = project.data?.maxTokenBuy ?? 0n
    const decimals = token.data?.decimals ?? 0

    if (!token.isSuccess || !project.isSuccess) {
        return <span></span>
    }

    return (
        <span title={formatUnits(maxTokenBuy, decimals)}>
            {formatAmount(maxTokenBuy, decimals)}
        </span>
    )
}

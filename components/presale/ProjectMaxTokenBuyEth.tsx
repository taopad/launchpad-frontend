"use client"

import { formatUnits } from "viem"
import { useTokenData } from "@/hooks/useTokenData"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"
import { formatAmount, computeEthAmount } from "@/lib/utils"

export function ProjectMaxTokenBuyEth() {
    const token = useTokenData()
    const projectWatch = useProjectWatchData()
    const projectStatic = useProjectStaticData()

    const ethPrice = projectWatch.data?.ethPrice ?? 0n
    const maxTokenBuy = projectStatic.data?.maxTokenBuy ?? 0n
    const decimals = token.data?.decimals ?? 0

    const maxTokenBuyEth = computeEthAmount(maxTokenBuy, ethPrice, decimals)

    if (!token.isSuccess || !projectStatic.isSuccess) {
        return <span></span>
    }

    return (
        <span title={formatUnits(maxTokenBuyEth, 18)}>
            {formatAmount(maxTokenBuyEth, 18)}
        </span>
    )
}

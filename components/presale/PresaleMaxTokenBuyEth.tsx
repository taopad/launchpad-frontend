"use client"

import { formatUnits } from "viem"
import { useTokenData } from "@/hooks/useTokenData"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"
import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"
import { formatAmount, computeEthAmount } from "@/lib/utils"

export function PresaleMaxTokenBuyEth() {
    const token = useTokenData()
    const presaleWatch = usePresaleWatchData()
    const presaleStatic = usePresaleStaticData()

    const ethPrice = presaleWatch.data?.ethPrice ?? 0n
    const maxTokenBuy = presaleStatic.data?.maxTokenBuy ?? 0n
    const decimals = token.data?.decimals ?? 0

    const maxTokenBuyEth = computeEthAmount(maxTokenBuy, ethPrice, decimals)

    if (!token.isSuccess || !presaleStatic.isSuccess) {
        return <span>&nbsp;</span>
    }

    return (
        <span title={formatUnits(maxTokenBuyEth, 18)}>
            {formatAmount(maxTokenBuyEth, 18)}
        </span>
    )
}

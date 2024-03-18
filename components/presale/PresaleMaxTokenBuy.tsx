"use client"

import { formatUnits } from "viem"
import { useTokenData } from "@/hooks/useTokenData"
import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"
import { formatAmount } from "@/lib/utils"

export function PresaleMaxTokenBuy() {
    const token = useTokenData()
    const presale = usePresaleStaticData()

    const maxTokenBuy = presale.data?.maxTokenBuy ?? 0n
    const decimals = token.data?.decimals ?? 0

    if (!token.isSuccess || !presale.isSuccess) {
        return <span>&nbsp;</span>
    }

    return (
        <span title={formatUnits(maxTokenBuy, decimals)}>
            {formatAmount(maxTokenBuy, decimals)}
        </span>
    )
}

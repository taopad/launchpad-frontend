"use client"

import { formatUnits } from "viem"
import { useTokenData } from "@/hooks/useTokenData"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"
import { formatAmount } from "@/lib/utils"

export function PresalePurchasedAmount() {
    const token = useTokenData()
    const presale = usePresaleWatchData()

    const amount = presale.data?.purchased ?? 0n
    const decimals = token.data?.decimals ?? 0

    if (!token.isSuccess || !presale.isSuccess) {
        return <span>&nbsp;</span>
    }

    return (
        <span title={formatUnits(amount, decimals)}>
            {formatAmount(amount, decimals)}
        </span>
    )
}

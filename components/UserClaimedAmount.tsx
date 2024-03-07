"use client"

import { formatUnits } from "viem"
import { useTokenStaticData } from "@/hooks/useTokenStaticData"
import { useUserWatchData } from "@/hooks/useUserWatchData"
import { formatAmount } from "@/lib/utils"

export function UserClaimedAmount() {
    const user = useUserWatchData()
    const token = useTokenStaticData()

    const amount = user.data?.claimed ?? 0n
    const decimals = token.data?.decimals ?? 0

    if (!user.isSuccess || !token.isSuccess) {
        return <span></span>
    }

    return (
        <span title={formatUnits(amount, decimals)}>
            {formatAmount(amount, decimals)}
        </span>
    )
}

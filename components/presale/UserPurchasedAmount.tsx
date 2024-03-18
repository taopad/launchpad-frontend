"use client"

import { formatUnits } from "viem"
import { useUserData } from "@/hooks/useUserData"
import { useTokenData } from "@/hooks/useTokenData"
import { formatAmount } from "@/lib/utils"

export function UserPurchasedAmount() {
    const user = useUserData()
    const token = useTokenData()

    const amount = user.data?.purchased ?? 0n
    const decimals = token.data?.decimals ?? 0

    if (!user.isSuccess || !token.isSuccess) {
        return <span>&nbsp;</span>
    }

    return (
        <span title={formatUnits(amount, decimals)}>
            {formatAmount(amount, decimals)}
        </span>
    )
}

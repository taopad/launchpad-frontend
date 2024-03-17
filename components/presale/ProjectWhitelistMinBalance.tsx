"use client"

import { formatAmount } from "@/lib/utils"
import { useWhitelist } from "@/hooks/useWhitelist"

export function ProjectWhitelistMinBalance() {
    const whitelist = useWhitelist()

    const minBalance = whitelist.data?.minBalance ?? 0n

    if (!whitelist.isSuccess) {
        return <span></span>
    }

    return <span>{formatAmount(minBalance, 18)}</span>
}

"use client"

import { formatAmount } from "@/lib/utils"
import { usePresaleWhitelist } from "@/hooks/usePresaleWhitelist"

export function ProjectWhitelistMinBalance() {
    const { minBalance } = usePresaleWhitelist()

    if (minBalance === undefined) {
        return <span></span>
    }

    return <span>{formatAmount(BigInt(minBalance), 18)}</span>
}

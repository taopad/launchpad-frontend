"use client"

import { formatEther } from "viem"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"

export function TokenEthPrice() {
    const presale = usePresaleWatchData()

    const price = presale.data?.ethPrice ?? 0n

    if (!presale.isSuccess) {
        return <span>&nbsp;</span>
    }

    return formatEther(price)
}

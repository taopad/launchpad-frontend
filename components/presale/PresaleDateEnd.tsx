"use client"

import { formatTimestamp } from "@/lib/utils"
import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"

export function PresaleDateEnd() {
    const presale = usePresaleStaticData()

    const timestamp = presale.data?.endDate ?? 0n

    if (!presale.isSuccess) {
        return <span></span>
    }

    return <span>{formatTimestamp(timestamp)}</span>
}

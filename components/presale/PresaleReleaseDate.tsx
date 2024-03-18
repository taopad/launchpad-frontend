"use client"

import { formatTimestamp } from "@/lib/utils"
import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"

export function PresaleReleaseDate() {
    const presale = usePresaleStaticData()

    const end = presale.data?.endDate ?? 0n
    const delay = presale.data?.releaseDelay ?? 0n
    const total = end + delay

    if (!presale.isSuccess) {
        return <span></span>
    }

    return <span>{formatTimestamp(total)}</span>
}

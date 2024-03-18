"use client"

import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"

export function PresaleVestingDuration() {
    const presale = usePresaleWatchData()

    const seconds = Number(presale.data?.vestingDuration ?? 0n)
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    if (!presale.isSuccess) {
        return <span></span>
    }

    return <span>{days}</span>
}

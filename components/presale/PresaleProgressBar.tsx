"use client"

import { useState, useEffect } from "react"

import { Progress } from "@/components/ui/progress"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"

export function PresaleProgressBar() {
    const presale = usePresaleWatchData()
    const [progress, setProgress] = useState(0)

    const hardcap = presale.data?.hardcap ?? 0n
    const purchased = presale.data?.purchased ?? 0n

    useEffect(() => {
        const percent = hardcap > 0 ? Number((purchased * 100n) / hardcap) : 0
        const timer = setTimeout(() => setProgress(percent), 500)
        return () => clearTimeout(timer)
    }, [hardcap, purchased])

    return <Progress value={progress} />
}

"use client"

import { useState, useEffect } from "react"

import { Progress } from "@/components/ui/progress"
import { useUserData } from "@/hooks/useUserData"

export function UserProgressBar() {
    const user = useUserData()
    const [progress, setProgress] = useState(0)

    const claimed = user.data?.claimed ?? 0n
    const purchased = user.data?.purchased ?? 0n

    useEffect(() => {
        const percent = purchased > 0 ? Number((claimed * 100n) / purchased) : 0
        const timer = setTimeout(() => setProgress(percent), 500)
        return () => clearTimeout(timer)
    }, [claimed, purchased])

    return <Progress value={progress} />
}

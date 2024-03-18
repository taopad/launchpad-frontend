"use client"

import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"

export function PresaleName() {
    const presale = usePresaleStaticData()

    const name = presale.data?.name ?? ""

    if (!presale.isSuccess) {
        return <span></span>
    }

    return <span>{name}</span>
}

"use client"

import { Address } from "@/components/Address"
import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"

export function PresaleTokenAddress() {
    const presale = usePresaleStaticData()

    const token = presale.data?.token ?? ""

    if (!presale.isSuccess) {
        return <span></span>
    }

    return <Address>{token}</Address>
}

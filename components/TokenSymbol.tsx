"use client"

import { useTokenStaticData } from "@/hooks/useTokenStaticData"

export function TokenSymbol() {
    const token = useTokenStaticData()

    const symbol = token.data?.symbol ?? ""

    if (!token.isSuccess) {
        return <span></span>
    }

    return <span>${symbol}</span>
}

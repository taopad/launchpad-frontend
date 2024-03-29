"use client"

import { useTokenData } from "@/hooks/useTokenData"

export function TokenSymbol() {
    const token = useTokenData()

    const symbol = token.data?.symbol ?? ""

    if (!token.isSuccess) {
        return <span>&nbsp;</span>
    }

    return <span>${symbol}</span>
}

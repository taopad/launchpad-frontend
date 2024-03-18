"use client"

import { createContext } from "react"

type PresaleContractProps = {
    chainId: number
    address: `0x${string}`
    children: React.ReactNode
}

type PresaleContractState = {
    chainId: number | undefined
    address: `0x${string}` | undefined
}

export const PresaleContractContext = createContext<PresaleContractState>({
    chainId: undefined,
    address: undefined,
})

export function PresaleContractProvider({ chainId, address, children }: PresaleContractProps) {
    const value = { chainId, address }

    return (
        <PresaleContractContext.Provider value={value}>
            {children}
        </PresaleContractContext.Provider >
    )
}

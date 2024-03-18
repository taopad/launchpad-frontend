"use client"

import { createContext } from "react"

type PresaleWhitelistProps = {
    blockNumber: string | undefined,
    minBalance: string | undefined,
    root: `0x${string}` | undefined,
    children: React.ReactNode,
}

type PresaleWhitelistState = {
    blockNumber: bigint | undefined,
    minBalance: bigint | undefined,
    root: `0x${string}` | undefined,
}

export const PresaleWhitelistContext = createContext<PresaleWhitelistState>({
    blockNumber: undefined,
    minBalance: undefined,
    root: undefined,
})

export function PresaleWhitelistProvider(props: PresaleWhitelistProps) {
    const value = {
        blockNumber: props.blockNumber === undefined ? undefined : BigInt(props.blockNumber),
        minBalance: props.minBalance === undefined ? undefined : BigInt(props.minBalance),
        root: props.root
    }

    return (
        <PresaleWhitelistContext.Provider value={value}>
            {props.children}
        </PresaleWhitelistContext.Provider >
    )
}

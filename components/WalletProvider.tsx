"use client"

import "@rainbow-me/rainbowkit/styles.css"

import { useState } from "react"
import { WagmiProvider, cookieToInitialState } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config as allChainConfig, getConfig } from "@/config/wallet"

export function WalletProvider({ chainId, cookie, children }: { chainId?: number, cookie: string | null, children: React.ReactNode }) {
    const config = chainId === undefined ? allChainConfig : getConfig(chainId)
    const initialState = cookieToInitialState(config, cookie)
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

import "@rainbow-me/rainbowkit/styles.css"

import { Chain, mainnet } from "wagmi/chains"
import { testnet } from "@/config/testnet"
import { createConfig, createStorage, cookieStorage, http, fallback } from "wagmi"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import {
    injectedWallet,
    rainbowWallet,
    coinbaseWallet,
    walletConnectWallet,
    trustWallet,
    rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets"

const appName = "Taopad launchpad"
const projectId = "031d4ad6ce63b830ab346fb92b96f328"
const isDev = process.env.NODE_ENV === "development"

const chains = [mainnet, testnet]

const rpcs = {
    [mainnet.id]: isDev
        ? "https://rpc.ankr.com/eth"
        : "https://eth-mainnet.g.alchemy.com/v2/oW_Y3js1QPWpFXnCIQm-z56vysAdoppY",
    [testnet.id]: testnet.rpcUrls.public.http[0]
}

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Wallets',
            wallets: [
                injectedWallet,
                rainbowWallet,
                coinbaseWallet,
                walletConnectWallet,
                trustWallet,
                rabbyWallet,
            ],
        },
    ],
    { appName, projectId }
)

export const config = createConfig({
    ssr: true,
    storage: createStorage({ storage: cookieStorage, key: "wagmi-all" }),
    connectors,
    chains: [mainnet],
    transports: {
        [mainnet.id]: fallback([http(rpcs[mainnet.id]), http()]),
    },
})

export const getConfig = (chainId: number) => {
    const chain = chains.find(chain => chain.id === chainId)

    if (chain === undefined) {
        throw new Error(`chain id ${chainId} is not supported`)
    }

    return createConfig({
        ssr: true,
        storage: createStorage({ storage: cookieStorage, key: `wagmi-${chainId}` }),
        connectors,
        chains: [chain],
        transports: {
            [mainnet.id]: fallback([http(rpcs[mainnet.id]), http()]),
            [testnet.id]: http(),
        },
    })
}

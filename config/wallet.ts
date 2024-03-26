import { mainnet } from "wagmi/chains"
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

const chains = [mainnet, testnet]

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

const transports = {
    [mainnet.id]: fallback([
        http("https://eth-mainnet.g.alchemy.com/v2/Hvky-afpKHoxm1AgXx7sLw_Sw8h7bGh0"),
        http("https://rpc.ankr.com/eth"),
        http(),
    ]),
    [testnet.id]: http(testnet.rpcUrls.public.http[0]),
}

export const config = createConfig({
    ssr: true,
    connectors,
    transports,
    storage: createStorage({ storage: cookieStorage, key: "wagmi-all" }),
    chains: [mainnet],
})

export const getConfig = (chainId: number) => {
    const chain = chains.find(chain => chain.id === chainId)

    if (chain === undefined) {
        throw new Error(`chain id ${chainId} is not supported`)
    }

    return createConfig({
        ssr: true,
        connectors,
        transports,
        storage: createStorage({ storage: cookieStorage, key: `wagmi-${chainId}` }),
        chains: [chain],
    })
}

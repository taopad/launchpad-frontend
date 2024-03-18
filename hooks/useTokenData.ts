import { erc20Abi } from "viem"
import { useReadContracts } from "wagmi"
import { usePresaleContract } from "./usePresaleContract"
import { usePresaleStaticData } from "./usePresaleStaticData"

export function useTokenData() {
    const presale = usePresaleStaticData()
    const { chainId } = usePresaleContract()

    const address = presale.data?.token

    return useReadContracts({
        allowFailure: false,
        contracts: [
            {
                chainId,
                address,
                abi: erc20Abi,
                functionName: "symbol",
            },
            {
                chainId,
                address,
                abi: erc20Abi,
                functionName: "decimals",
            },
        ],
        query: {
            enabled: presale.isSuccess,
            select: (data) => ({
                symbol: data[0],
                decimals: data[1],
            })
        },
    })
}

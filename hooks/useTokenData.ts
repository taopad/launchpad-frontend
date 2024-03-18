import { erc20Abi } from "viem"
import { useReadContracts } from "wagmi"
import { usePresaleContract } from "./usePresaleContract"
import { useProjectStaticData } from "./useProjectStaticData"

export function useTokenData() {
    const project = useProjectStaticData()
    const { chainId } = usePresaleContract()

    const address = project.data?.token

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
            enabled: project.isSuccess,
            select: (data) => ({
                symbol: data[0],
                decimals: data[1],
            })
        },
    })
}

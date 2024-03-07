import { erc20Abi } from "viem"
import { useReadContracts } from "wagmi"
import { useContract } from "./useContract"
import { useProjectStaticData } from "./useProjectStaticData"

export function useTokenStaticData() {
    const { chainId } = useContract()
    const project = useProjectStaticData()

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

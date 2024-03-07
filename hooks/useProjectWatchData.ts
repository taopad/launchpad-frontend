import { useEffect } from "react"
import { useBlockNumber, useReadContracts } from "wagmi"
import { useContract } from "./useContract"
import abi from "@/config/abi/LaunchpadAbi"

export function useProjectWatchData() {
    const contract = useContract()

    const { data: blockNumber } = useBlockNumber({
        chainId: contract.chainId,
        watch: true,
    })

    const hook = useReadContracts({
        allowFailure: false,
        contracts: [
            {
                abi,
                ...contract,
                functionName: "tokenHardCap",
            },
            {
                abi,
                ...contract,
                functionName: "totalPurchasedAmount",
            },
            {
                abi,
                ...contract,
                functionName: "ethPricePerToken",
            },
            {
                abi,
                ...contract,
                functionName: "vestingDuration",
            },
            {
                abi,
                ...contract,
                functionName: "wlBlockNumber",
            },
            {
                abi,
                ...contract,
                functionName: "wlMinBalance",
            },
            {
                abi,
                ...contract,
                functionName: "isStarted",
            },
            {
                abi,
                ...contract,
                functionName: "isEnded",
            },
        ],
        query: {
            select: (data) => ({
                hardcap: data[0],
                purchased: data[1],
                ethPrice: data[2],
                vestingDuration: data[3],
                wlBlockNumber: data[4],
                wlMinBalance: data[5],
                isStarted: data[6],
                isEnded: data[7],
            }),
        },
    })

    useEffect(() => { hook.refetch() }, [blockNumber])

    return hook
}

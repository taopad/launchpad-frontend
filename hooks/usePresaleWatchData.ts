import { useEffect } from "react"
import { useBlockNumber, useReadContracts } from "wagmi"
import { usePresaleContract } from "./usePresaleContract"
import abi from "@/config/abi/LaunchpadAbi"

export function usePresaleWatchData() {
    const contract = usePresaleContract()

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
                functionName: "wlRoot",
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
                wlRoot: data[4],
                isStarted: data[5],
                isEnded: data[6],
            }),
        },
    })

    useEffect(() => { hook.refetch() }, [blockNumber])

    return hook
}

import { useEffect } from "react"
import { useAccount, useBlockNumber, useReadContracts } from "wagmi"
import { useContract } from "./useContract"
import abi from "@/config/abi/LaunchpadAbi"

export function useUserWatchData() {
    const contract = useContract()
    const { isConnected, address } = useAccount()

    const { data: blockNumber } = useBlockNumber({
        chainId: contract.chainId,
        watch: true,
    })

    const enabled = isConnected
        && address !== undefined
        && contract.chainId !== undefined
        && contract.address !== undefined

    const hook = useReadContracts({
        scopeKey: address,
        allowFailure: false,
        contracts: [
            {
                abi,
                ...contract,
                functionName: "claimedAmount",
                args: [address ?? "0x"],
            },
            {
                abi,
                ...contract,
                functionName: "claimableAmount",
                args: [address ?? "0x"],
            },
            {
                abi,
                ...contract,
                functionName: "purchasedAmount",
                args: [address ?? "0x"],
            },
        ],
        query: {
            enabled,
            select: (data) => ({
                claimed: data[0],
                claimable: data[1],
                purchased: data[2],
            }),
        },
    })

    useEffect(() => { hook.refetch() }, [blockNumber])

    return hook
}

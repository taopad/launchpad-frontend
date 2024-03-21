import { useEffect } from "react"
import { usePresaleContract } from "./usePresaleContract"
import { useAccount, useBlockNumber, useReadContracts } from "wagmi"
import abi from "@/config/abi/LaunchpadAbi"

export function useUserData() {
    const contract = usePresaleContract()
    const { isConnected, address } = useAccount()

    const hook = useReadContracts({
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
            enabled: isConnected && address !== undefined,
            select: (data) => ({
                claimed: data[0],
                claimable: data[1],
                purchased: data[2],
            }),
        },
    })

    const { data: blockNumber } = useBlockNumber({
        chainId: contract.chainId,
        watch: true,
    })

    useEffect(() => { hook.refetch() }, [blockNumber])

    return hook;
}

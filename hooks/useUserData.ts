import { useAccount, useReadContracts } from "wagmi"
import { useContract } from "./useContract"
import abi from "@/config/abi/LaunchpadAbi"

export function useUserData() {
    const contract = useContract()
    const { isConnected, address } = useAccount()

    return useReadContracts({
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
            enabled: isConnected && address !== undefined,
            select: (data) => ({
                claimed: data[0],
                claimable: data[1],
                purchased: data[2],
            }),
        },
    })
}

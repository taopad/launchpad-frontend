import { useAccount } from "wagmi"
import { useQuery } from "@tanstack/react-query"
import { usePresaleContract } from "./usePresaleContract"

type UserProof = {
    proof: `0x${string}`[]
}

export const useUserProof = () => {
    const contract = usePresaleContract()
    const { isConnected, address } = useAccount()

    const chainId = contract.chainId ?? 0
    const launchpad = contract.address ?? "0x"
    const userAddress = address ?? "0x"

    const enabled = isConnected
        && address !== undefined
        && contract.chainId !== undefined
        && contract.address !== undefined

    return useQuery({
        enabled,
        queryKey: ["user-proof", chainId, launchpad, userAddress],
        queryFn: async (): Promise<UserProof> => {
            const url = `/api/whitelists/${chainId}/${launchpad}/proofs/${userAddress}`

            const response = await fetch(url)

            return await response.json()
        },
    })
}

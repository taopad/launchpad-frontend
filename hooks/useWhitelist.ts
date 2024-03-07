import { useAccount } from "wagmi"
import { useQuery } from "@tanstack/react-query"
import { useContract } from "./useContract"

type Whitelist = {
    blockNumber: bigint
    minBalance: bigint
}

export const useWhitelist = () => {
    const contract = useContract()

    const chainId = contract.chainId ?? 0
    const launchpad = contract.address ?? "0x"

    const enabled = contract.chainId !== undefined && contract.address !== undefined

    return useQuery({
        enabled,
        queryKey: ["whitelist", chainId, launchpad],
        queryFn: async (): Promise<Whitelist> => {
            const url = `/api/whitelists/${chainId}/${launchpad}`

            const response = await fetch(url)

            const json = await response.json()

            return {
                blockNumber: BigInt(json.block_number),
                minBalance: BigInt(json.min_balance),
            }
        },
    })
}

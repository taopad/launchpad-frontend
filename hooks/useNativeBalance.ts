import { useAccount, useBalance } from "wagmi"
import { usePresaleContract } from "./usePresaleContract"

export function useNativeBalance() {
    const { address } = useAccount()
    const { chainId } = usePresaleContract()

    return useBalance({ chainId, address })
}

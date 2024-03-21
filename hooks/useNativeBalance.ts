import { useEffect } from "react"
import { usePresaleContract } from "./usePresaleContract"
import { useAccount, useBlockNumber, useBalance } from "wagmi"

export function useNativeBalance() {
    const { address } = useAccount()
    const { chainId } = usePresaleContract()

    const hook = useBalance({ chainId, address })

    const { data: blockNumber } = useBlockNumber({ chainId, watch: true })

    useEffect(() => { hook.refetch() }, [blockNumber])

    return hook
}

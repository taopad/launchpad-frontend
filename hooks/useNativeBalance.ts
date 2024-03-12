import { useEffect } from "react"
import { useAccount, useBlockNumber, useBalance } from "wagmi"
import { useContract } from "./useContract"

export function useNativeBalance() {
    const { chainId } = useContract()
    const { address } = useAccount()

    const { data: blockNumber } = useBlockNumber({ chainId, watch: true })

    const hook = useBalance({ chainId, address })

    useEffect(() => { hook.refetch() }, [blockNumber])

    return hook
}

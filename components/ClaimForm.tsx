"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/Spinner"
import { TokenSymbol } from "@/components/TokenSymbol"
import { UserClaimableAmount } from "@/components/UserClaimableAmount"
import { useContract } from "@/hooks/useContract"
import { useUserData } from "@/hooks/useUserData"
import { useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import abi from "@/config/abi/LaunchpadAbi"

function useSimulateClaim() {
    const contract = useContract()
    const { isConnected, address } = useAccount()

    const user = useUserData()

    const claimable = user.data?.claimable ?? 0n

    const enabled = isConnected
        && user.isSuccess
        && !user.isRefetching
        && claimable > 0

    return useSimulateContract({
        abi,
        ...contract,
        account: address,
        functionName: "claimTokens",
        scopeKey: address,
        query: { enabled },
    })
}

export function ClaimForm() {
    const user = useUserData()

    const { chainId } = useContract()
    const { data, isLoading } = useSimulateClaim()
    const { data: hash, isPending, writeContract } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash, chainId, confirmations: 1 })

    const loading = isLoading || isPending || isConfirming
    const disabled = loading || !Boolean(data?.request)

    return (
        <form className="flex flex-col gap-4" onSubmit={e => {
            e.preventDefault()
            writeContract(data!.request, { onSuccess: () => user.refetch() })
        }}>
            <Button type="submit" variant="secondary" className="w-full" disabled={disabled}>
                <Spinner loading={loading} /> Claim
            </Button>
            <p className="muted">
                Claimable tokens: <UserClaimableAmount /> <TokenSymbol />
            </p>
        </form>
    )
}

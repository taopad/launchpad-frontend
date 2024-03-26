"use client"

import { TokenSymbol } from "./TokenSymbol"
import { UserClaimableAmount } from "./UserClaimableAmount"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/Spinner"
import { useUserData } from "@/hooks/useUserData"
import { usePresaleContract } from "@/hooks/usePresaleContract"
import { useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import abi from "@/config/abi/LaunchpadAbi"

function useSimulateClaim() {
    const contract = usePresaleContract()
    const { isConnected, address } = useAccount()

    const user = useUserData()

    const claimable = user.data?.claimable ?? 0n

    const enabled = isConnected
        && user.isSuccess
        && claimable > 0

    return useSimulateContract({
        abi,
        ...contract,
        account: address,
        functionName: "claimTokens",
        query: { enabled },
    })
}

export function ClaimForm() {
    const user = useUserData()

    const { chainId } = usePresaleContract()
    const { data, isLoading } = useSimulateClaim()
    const { data: hash, isPending, writeContract } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash, chainId, confirmations: 1 })

    const claimable = user.data?.claimable ?? 0n

    const loading = isLoading || isPending || isConfirming
    const disabled = loading || !user.isSuccess || claimable === 0n || !Boolean(data?.request)

    return (
        <form className="flex flex-col gap-4" onSubmit={e => {
            e.preventDefault()
            writeContract(data!.request)
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

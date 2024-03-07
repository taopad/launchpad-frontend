"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/Spinner"
import { useContract } from "@/hooks/useContract"
import { useUserProof } from "@/hooks/useUserProof"
import { useBigintInput } from "@/hooks/useBigintInput"
import { useUserWatchData } from "@/hooks/useUserWatchData"
import { useTokenStaticData } from "@/hooks/useTokenStaticData"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"
import { UserPurchasingAmount } from "@/components/UserPurchasingAmount"
import { useWatchNativeBalance } from "@/hooks/useWatchNativeBalance"
import { useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { computeTokenAmount } from "@/lib/utils"
import abi from "@/config/abi/LaunchpadAbi"

const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

const useSimulateBuy = (amount: bigint) => {
    const contract = useContract()
    const { isConnected, address } = useAccount()

    const user = useUserWatchData()
    const token = useTokenStaticData()
    const proofWatch = useUserProof()
    const projectWatch = useProjectWatchData()
    const projectStatic = useProjectStaticData()
    const balanceWatch = useWatchNativeBalance()

    const proof = proofWatch.data?.proof ?? []
    const balance = balanceWatch.data?.value ?? 0n
    const minTokenBuy = projectStatic.data?.minTokenBuy ?? 0n
    const maxTokenBuy = projectStatic.data?.maxTokenBuy ?? 0n
    const hardcap = projectWatch.data?.hardcap ?? 0n
    const totalPurchased = projectWatch.data?.purchased ?? 0n
    const wlRoot = projectWatch.data?.wlRoot ?? zero
    const isStarted = projectWatch.data?.isStarted ?? false
    const isEnded = projectWatch.data?.isEnded ?? true
    const userPurchased = user.data?.purchased ?? 0n
    const ethPrice = projectWatch.data?.ethPrice ?? 0n
    const decimals = token.data?.decimals ?? 0
    const tokenAmount = computeTokenAmount(amount, ethPrice, decimals)

    const enabled = isConnected
        && user.isSuccess
        && token.isSuccess
        && projectWatch.isSuccess
        && projectStatic.isSuccess
        && balanceWatch.isSuccess
        && isStarted && !isEnded
        && (wlRoot === zero || proofWatch.isSuccess)
        && amount > 0
        && tokenAmount > 0
        && balance >= amount
        && minTokenBuy <= tokenAmount
        && maxTokenBuy >= tokenAmount + userPurchased
        && hardcap >= tokenAmount + totalPurchased
        && (wlRoot === zero || proof.length > 0)

    return useSimulateContract({
        abi,
        ...contract,
        value: amount,
        account: address,
        functionName: "buyTokens",
        args: [proof],
        scopeKey: address,
        query: { enabled },
    })
}

export function BuyForm() {
    const amount = useBigintInput(0n)

    const { chainId } = useContract()
    const { data, isLoading } = useSimulateBuy(amount.value)
    const { data: hash, isPending, writeContract } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash, chainId, confirmations: 1 })

    const loading = isLoading || isPending || isConfirming
    const disabled = amount.value === 0n || loading || !Boolean(data?.request)

    return (
        <form className="flex flex-col gap-4" onSubmit={e => {
            e.preventDefault()
            writeContract(data!.request, { onSuccess: amount.reset })
        }}>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="$ETH amount"
                    value={amount.valueStr}
                    onChange={e => amount.setValueStr(e.target.value.trim())}
                    min={0}
                />
                <Button type="submit" variant="secondary" disabled={disabled}>
                    <Spinner loading={loading} /> purchase
                </Button>
            </div>
            <p className="muted">
                <UserPurchasingAmount amount={amount.value} />
            </p>
        </form>
    )
}

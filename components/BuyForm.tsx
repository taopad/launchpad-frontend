"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/Spinner"
import { useContract } from "@/hooks/useContract"
import { useUserData } from "@/hooks/useUserData"
import { useTokenData } from "@/hooks/useTokenData"
import { useUserProof } from "@/hooks/useUserProof"
import { useBigintInput } from "@/hooks/useBigintInput"
import { useNativeBalance } from "@/hooks/useNativeBalance"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"
import { UserPurchasingAmount } from "@/components/UserPurchasingAmount"
import { useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { computeTokenAmount } from "@/lib/utils"
import abi from "@/config/abi/LaunchpadAbi"

const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

const useSimulateBuy = (amount: bigint) => {
    const contract = useContract()
    const { isConnected, address } = useAccount()

    const hooks = {
        user: useUserData(),
        token: useTokenData(),
        proof: useUserProof(),
        balance: useNativeBalance(),
        project: {
            watch: useProjectWatchData(),
            static: useProjectStaticData(),
        },
    }

    const proof = hooks.proof.data?.proof ?? []
    const balance = hooks.balance.data?.value ?? 0n
    const minTokenBuy = hooks.project.static.data?.minTokenBuy ?? 0n
    const maxTokenBuy = hooks.project.static.data?.maxTokenBuy ?? 0n
    const wlRoot = hooks.project.watch.data?.wlRoot ?? zero
    const hardcap = hooks.project.watch.data?.hardcap ?? 0n
    const ethPrice = hooks.project.watch.data?.ethPrice ?? 0n
    const isStarted = hooks.project.watch.data?.isStarted ?? false
    const isEnded = hooks.project.watch.data?.isEnded ?? true
    const totalPurchased = hooks.project.watch.data?.purchased ?? 0n
    const userPurchased = hooks.user.data?.purchased ?? 0n
    const decimals = hooks.token.data?.decimals ?? 0
    const tokenAmount = computeTokenAmount(amount, ethPrice, decimals)

    const enabled = isConnected
        && hooks.token.isSuccess
        && hooks.user.isSuccess
        && hooks.project.watch.isSuccess
        && hooks.project.static.isSuccess
        && hooks.balance.isSuccess
        && (wlRoot === zero || hooks.proof.isSuccess)
        && !hooks.user.isRefetching
        && !hooks.balance.isRefetching
        && amount > 0
        && tokenAmount > 0
        && balance >= amount
        && minTokenBuy <= tokenAmount
        && maxTokenBuy >= tokenAmount + userPurchased
        && hardcap >= tokenAmount + totalPurchased
        && (wlRoot === zero || proof.length > 0)
        && isStarted && !isEnded

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
    const user = useUserData()
    const balance = useNativeBalance()
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
            writeContract(data!.request, {
                onSuccess: () => {
                    user.refetch()
                    balance.refetch()
                    amount.reset()
                }
            })
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

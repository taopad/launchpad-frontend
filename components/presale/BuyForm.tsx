"use client"

import { UserPurchasingAmount } from "./UserPurchasingAmount"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/Spinner"
import { useUserData } from "@/hooks/useUserData"
import { useTokenData } from "@/hooks/useTokenData"
import { useUserProof } from "@/hooks/useUserProof"
import { useBigintInput } from "@/hooks/useBigintInput"
import { useNativeBalance } from "@/hooks/useNativeBalance"
import { usePresaleContract } from "@/hooks/usePresaleContract"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"
import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"
import { useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { computeTokenAmount, computeEthAmount, isZeroBytes } from "@/lib/utils"
import abi from "@/config/abi/LaunchpadAbi"

const useSimulateBuy = (amount: bigint) => {
    const contract = usePresaleContract()
    const { isConnected, address } = useAccount()

    const hooks = {
        user: useUserData(),
        token: useTokenData(),
        proof: useUserProof(),
        balance: useNativeBalance(),
        presale: {
            watch: usePresaleWatchData(),
            static: usePresaleStaticData(),
        },
    }

    const proof = hooks.proof.data?.proof ?? []
    const balance = hooks.balance.data?.value ?? 0n
    const minTokenBuy = hooks.presale.static.data?.minTokenBuy ?? 0n
    const maxTokenBuy = hooks.presale.static.data?.maxTokenBuy ?? 0n
    const wlRoot = hooks.presale.watch.data?.wlRoot ?? "0x"
    const hardcap = hooks.presale.watch.data?.hardcap ?? 0n
    const ethPrice = hooks.presale.watch.data?.ethPrice ?? 0n
    const isStarted = hooks.presale.watch.data?.isStarted ?? false
    const isEnded = hooks.presale.watch.data?.isEnded ?? true
    const totalPurchased = hooks.presale.watch.data?.purchased ?? 0n
    const userPurchased = hooks.user.data?.purchased ?? 0n
    const decimals = hooks.token.data?.decimals ?? 0
    const tokenAmount = computeTokenAmount(amount, ethPrice, decimals)

    const enabled = isConnected
        && hooks.token.isSuccess
        && hooks.user.isSuccess
        && hooks.presale.watch.isSuccess
        && hooks.presale.static.isSuccess
        && hooks.balance.isSuccess
        && hooks.proof.isSuccess
        && amount > 0
        && tokenAmount > 0
        && balance >= amount
        && minTokenBuy <= tokenAmount
        && maxTokenBuy >= tokenAmount + userPurchased
        && hardcap >= tokenAmount + totalPurchased
        && isStarted && !isEnded
        && (isZeroBytes(wlRoot) || proof.length > 0)

    return useSimulateContract({
        abi,
        ...contract,
        value: amount,
        account: address,
        functionName: "buyTokens",
        args: [proof],
        query: { enabled },
    })
}

export function BuyForm() {
    const amount = useBigintInput(0n)

    const { chainId } = usePresaleContract()
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
                <MaxButton setAmount={amount.setValue} />
                <Button type="submit" variant="secondary" disabled={disabled}>
                    <Spinner loading={loading} /> Purchase
                </Button>
            </div>
            <p className="muted">
                <UserPurchasingAmount amount={amount.value} />
            </p>
        </form>
    )
}

function MaxButton({ setAmount }: { setAmount: (amount: bigint) => void }) {
    const user = useUserData()
    const token = useTokenData()
    const presaleWatch = usePresaleWatchData()
    const presaleStatic = usePresaleStaticData()
    const { isConnected } = useAccount()

    const hardcap = presaleWatch.data?.hardcap ?? 0n
    const ethPrice = presaleWatch.data?.ethPrice ?? 0n
    const totalPurchased = presaleWatch.data?.purchased ?? 0n
    const minTokenBuy = presaleStatic.data?.minTokenBuy ?? 0n
    const maxTokenBuy = presaleStatic.data?.maxTokenBuy ?? 0n
    const userPurchased = user.data?.purchased ?? 0n
    const decimals = token.data?.decimals ?? 0

    const remainingUser = maxTokenBuy - userPurchased
    const remainingTotal = hardcap - totalPurchased
    const remaining = remainingUser < remainingTotal ? remainingUser : remainingTotal

    const maxTokenBuyEth = computeEthAmount(remaining, ethPrice, decimals)

    const disabled = !isConnected
        || !user.isSuccess
        || !token.isSuccess
        || !presaleWatch.isSuccess
        || !presaleStatic.isSuccess
        || remaining < minTokenBuy

    return (
        <Button
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={() => setAmount(maxTokenBuyEth)}
        >
            Max
        </Button>
    )
}

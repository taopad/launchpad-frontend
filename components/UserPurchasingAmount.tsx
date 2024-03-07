"use client"

import { formatUnits } from "viem"
import { TokenSymbol } from "@/components/TokenSymbol"
import { useUserProof } from "@/hooks/useUserProof"
import { useUserWatchData } from "@/hooks/useUserWatchData"
import { useTokenStaticData } from "@/hooks/useTokenStaticData"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"
import { useWatchNativeBalance } from "@/hooks/useWatchNativeBalance"
import { computeTokenAmount } from "@/lib/utils"

const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

export function UserPurchasingAmount({ amount }: { amount: bigint }) {
    const user = useUserWatchData()
    const token = useTokenStaticData()
    const proofWatch = useUserProof()
    const projectWatch = useProjectWatchData()
    const balanceWatch = useWatchNativeBalance()
    const projectStatic = useProjectStaticData()

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

    const loaded = user.isSuccess
        && token.isSuccess
        && projectWatch.isSuccess
        && projectStatic.isSuccess
        && (wlRoot === zero || proofWatch.isSuccess)

    if (!loaded) {
        return <span>-</span>
    }

    if (wlRoot !== zero && proof.length === 0) {
        return (
            <span className="text-red-900">
                Not whitelisted
            </span>
        )
    }

    if (!isStarted) {
        return (
            <span className="text-red-900">
                Sale not started
            </span>
        )
    }

    if (isEnded) {
        return (
            <span className="text-red-900">
                Sale ended
            </span>
        )
    }

    if (tokenAmount === 0n) {
        return (
            <span>
                Purchasing 0 <TokenSymbol />
            </span>
        )
    }

    if (balance < amount) {
        return (
            <span className="text-red-900">
                Insufficient $ETH balance
            </span>
        )
    }

    if (minTokenBuy > tokenAmount) {
        return (
            <span className="text-red-900">
                Purchasing {formatUnits(tokenAmount, decimals)} <TokenSymbol /> (min: {formatUnits(minTokenBuy, decimals)})
            </span>
        )
    }

    if (maxTokenBuy < tokenAmount + userPurchased) {
        return (
            <span className="text-red-900">
                Purchasing {formatUnits(tokenAmount, decimals)} <TokenSymbol /> (above max purchase: {formatUnits(maxTokenBuy, decimals)})
            </span>
        )
    }

    if (hardcap < tokenAmount + totalPurchased) {
        return (
            <span className="text-red-900">
                Purchasing {formatUnits(tokenAmount, decimals)} <TokenSymbol /> (above hardcap)
            </span>
        )
    }

    return (
        <span>
            Purchasing {formatUnits(tokenAmount, decimals)} <TokenSymbol />
        </span>
    )
}

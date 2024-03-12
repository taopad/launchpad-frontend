"use client"

import { formatUnits } from "viem"
import { TokenSymbol } from "@/components/TokenSymbol"
import { useUserData } from "@/hooks/useUserData"
import { useTokenData } from "@/hooks/useTokenData"
import { useUserProof } from "@/hooks/useUserProof"
import { useNativeBalance } from "@/hooks/useNativeBalance"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { useProjectStaticData } from "@/hooks/useProjectStaticData"
import { computeTokenAmount } from "@/lib/utils"

const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

export function UserPurchasingAmount({ amount }: { amount: bigint }) {
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

    const loaded = hooks.token.isSuccess
        && hooks.user.isSuccess
        && hooks.project.watch.isSuccess
        && hooks.project.static.isSuccess
        && (wlRoot === zero || hooks.proof.isSuccess)

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

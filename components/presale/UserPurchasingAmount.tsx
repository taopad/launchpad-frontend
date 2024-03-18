"use client"

import { TokenSymbol } from "./TokenSymbol"

import { useAccount } from "wagmi"
import { useUserData } from "@/hooks/useUserData"
import { useTokenData } from "@/hooks/useTokenData"
import { useUserProof } from "@/hooks/useUserProof"
import { useNativeBalance } from "@/hooks/useNativeBalance"
import { usePresaleContract } from "@/hooks/usePresaleContract"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"
import { usePresaleStaticData } from "@/hooks/usePresaleStaticData"
import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit"
import { formatAmount, computeTokenAmount } from "@/lib/utils"
import { Spinner } from "@/components/Spinner"

const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

export function UserPurchasingAmount({ amount }: { amount: bigint }) {
    const { chainId } = usePresaleContract()
    const { isConnected, chain } = useAccount()
    const { openChainModal } = useChainModal()
    const { openConnectModal } = useConnectModal()

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
    const wlRoot = hooks.presale.watch.data?.wlRoot ?? zero
    const hardcap = hooks.presale.watch.data?.hardcap ?? 0n
    const ethPrice = hooks.presale.watch.data?.ethPrice ?? 0n
    const isStarted = hooks.presale.watch.data?.isStarted ?? false
    const isEnded = hooks.presale.watch.data?.isEnded ?? true
    const totalPurchased = hooks.presale.watch.data?.purchased ?? 0n
    const userPurchased = hooks.user.data?.purchased ?? 0n
    const decimals = hooks.token.data?.decimals ?? 0
    const remaining = maxTokenBuy - userPurchased
    const tokenAmount = computeTokenAmount(amount, ethPrice, decimals)

    const loaded = isConnected
        && hooks.token.isSuccess
        && hooks.user.isSuccess
        && hooks.presale.watch.isSuccess
        && hooks.presale.static.isSuccess
        && (wlRoot === zero || hooks.proof.isSuccess)

    if (!isConnected) {
        return <a href="#" onClick={openConnectModal}>Connect wallet</a>
    }

    if (chain === undefined || chain.id !== chainId) {
        return <a href="#" onClick={openChainModal}>Wrong chain</a>
    }

    if (!loaded) {
        return <span><Spinner /></span>
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

    if (hardcap < tokenAmount + totalPurchased) {
        return (
            <span className="text-red-900">
                Purchasing {formatAmount(tokenAmount, decimals)} <TokenSymbol /> (above hardcap)
            </span>
        )
    }

    if (maxTokenBuy < tokenAmount + userPurchased) {
        return (
            <span className="text-red-900">
                Purchasing {formatAmount(tokenAmount, decimals)} <TokenSymbol /> (remaining: {formatAmount(remaining, decimals)})
            </span>
        )
    }

    if (minTokenBuy > tokenAmount) {
        return (
            <span className="text-red-900">
                Purchasing {formatAmount(tokenAmount, decimals)} <TokenSymbol /> (min: {formatAmount(minTokenBuy, decimals)})
            </span>
        )
    }

    return (
        <span>
            Purchasing {formatAmount(tokenAmount, decimals)} <TokenSymbol />
        </span>
    )
}

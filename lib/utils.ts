import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { formatUnits } from "viem"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatAmount(amount: bigint, decimals: number) {
    return parseFloat(formatUnits(amount, decimals)).toLocaleString("en-US", {
        maximumFractionDigits: 3,
        useGrouping: false,
    })
}

export const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)

    const usDate = date.toLocaleDateString("en-US")

    const utcTime = date.toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour: '2-digit',
        minute: '2-digit',
    })

    return `${usDate} ${utcTime}`
}

export const computeEthAmount = (amount: bigint, ethPrice: bigint, decimals: number) => {
    const tokenUnit = 10n ** BigInt(decimals)

    return (amount * ethPrice) / tokenUnit
}

export const computeTokenAmount = (amount: bigint, ethPrice: bigint, decimals: number) => {
    const tokenUnit = 10n ** BigInt(decimals)

    if (ethPrice === 0n) return 0n

    return (amount * tokenUnit) / ethPrice
}

export const isZeroBytes = (bytes: `0x${string}`) => {
    const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

    return bytes === zero
}

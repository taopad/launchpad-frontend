"use client"

import Link from "next/link"
import { useWhitelist } from "@/hooks/useWhitelist"

export function ProjectWhitelistBlockNumber() {
    const whitelist = useWhitelist()

    const blockNumber = whitelist.data?.blockNumber ?? 0n

    if (!whitelist.isSuccess) {
        return <span></span>
    }

    return (
        <Link href={`https://etherscan.io/block/${blockNumber.toString()}`} target="_blank">
            {blockNumber.toString()}
        </Link>
    )
}

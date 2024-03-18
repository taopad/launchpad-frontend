"use client"

import Link from "next/link"
import { usePresaleWhitelist } from "@/hooks/usePresaleWhitelist"

export function ProjectWhitelistBlockNumber() {
    const { blockNumber } = usePresaleWhitelist()

    if (blockNumber === undefined) {
        return <span></span>
    }

    return (
        <Link href={`https://etherscan.io/block/${blockNumber.toString()}`} target="_blank">
            {blockNumber.toString()}
        </Link>
    )
}

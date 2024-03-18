"use client"

import Link from "next/link"
import { usePresaleWhitelist } from "@/hooks/usePresaleWhitelist"

export function PresaleWhitelistBlockNumber() {
    const { blockNumber } = usePresaleWhitelist()

    if (blockNumber === undefined) {
        return <span>&nbsp;</span>
    }

    return (
        <Link href={`https://etherscan.io/block/${blockNumber.toString()}`} target="_blank">
            {blockNumber.toString()}
        </Link>
    )
}

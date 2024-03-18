"use client"

import { PresaleWhitelistMinBalance } from "./PresaleWhitelistMinBalance"
import { PresaleWhitelistBlockNumber } from "./PresaleWhitelistBlockNumber"

import { ListBulletIcon } from "@radix-ui/react-icons"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

export function PresaleWhitelistAlert() {
    const presale = usePresaleWatchData()

    const root = presale.data?.wlRoot ?? zero

    if (!presale.isSuccess || root === zero) {
        return null
    }

    return (
        <Alert className="bg-black">
            <ListBulletIcon className="h-4 w-4" />
            <AlertTitle>This sale has a whitelist</AlertTitle>
            <AlertDescription>
                Only people holding &gt;<PresaleWhitelistMinBalance /> $TPAD tokens at block number <PresaleWhitelistBlockNumber /> can purchase tokens.
            </AlertDescription>
        </Alert>
    )
}

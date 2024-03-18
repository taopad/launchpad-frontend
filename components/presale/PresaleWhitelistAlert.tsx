"use client"

import { isZeroBytes } from "@/lib/utils"
import { ListBulletIcon } from "@radix-ui/react-icons"
import { usePresaleWatchData } from "@/hooks/usePresaleWatchData"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { PresaleWhitelistMinBalance } from "./PresaleWhitelistMinBalance"
import { PresaleWhitelistBlockNumber } from "./PresaleWhitelistBlockNumber"

export function PresaleWhitelistAlert() {
    const presale = usePresaleWatchData()

    const root = presale.data?.wlRoot ?? "0x"

    if (!presale.isSuccess || isZeroBytes(root)) {
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

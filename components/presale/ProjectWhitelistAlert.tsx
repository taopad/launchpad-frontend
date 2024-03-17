"use client"

import { ProjectWhitelistMinBalance } from "./ProjectWhitelistMinBalance"
import { ProjectWhitelistBlockNumber } from "./ProjectWhitelistBlockNumber"

import { ListBulletIcon } from "@radix-ui/react-icons"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"

export function ProjectWhitelistAlert() {
    const project = useProjectWatchData()

    const root = project.data?.wlRoot ?? zero

    if (!project.isSuccess || root === zero) {
        return null
    }

    return (
        <Alert className="bg-black">
            <ListBulletIcon className="h-4 w-4" />
            <AlertTitle>This sale has a whitelist</AlertTitle>
            <AlertDescription>
                Only people holding &gt;<ProjectWhitelistMinBalance /> $TPAD tokens at block number <ProjectWhitelistBlockNumber /> can purchase tokens.
            </AlertDescription>
        </Alert>
    )
}

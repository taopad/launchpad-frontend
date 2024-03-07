"use client"

import { ListBulletIcon } from "@radix-ui/react-icons"
import { useProjectWatchData } from "@/hooks/useProjectWatchData"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ProjectWhitelistMinBalance } from "@/components/ProjectWhitelistMinBalance"
import { ProjectWhitelistBlockNumber } from "@/components/ProjectWhitelistBlockNumber"

export function ProjectWhitelistAlert() {
    const project = useProjectWatchData()

    const blockNumber = project.data?.wlBlockNumber ?? 0n

    if (!project.isSuccess || blockNumber === 0n) {
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

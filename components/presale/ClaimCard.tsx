import { ClaimForm } from "./ClaimForm"
import { TokenSymbol } from "./TokenSymbol"
import { UserProgressBar } from "./UserProgressBar"
import { UserClaimedAmount } from "./UserClaimedAmount"
import { PresaleReleaseDate } from "./PresaleReleaseDate"
import { UserPurchasedAmount } from "./UserPurchasedAmount"
import { PresaleVestingDuration } from "./PresaleVestingDuration"

import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ClaimCard() {
    return (
        <Card className="bg-black">
            <CardHeader>
                <CardTitle>
                    Claim tokens
                </CardTitle>
            </CardHeader>
            <CardContent>
                Unlock at <PresaleReleaseDate />
                <Separator className="my-4" />
                Vesting duration is <PresaleVestingDuration /> days
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="muted">Claimed</span>
                        <span className="muted">Purchased</span>
                    </div>
                    <div className="flex justify-between">
                        <UserClaimedAmount />
                        <span><UserPurchasedAmount /> <TokenSymbol /></span>
                    </div>
                    <UserProgressBar />
                </div>
                <Separator className="my-4" />
                <ClaimForm />
            </CardContent>
        </Card>
    )
}

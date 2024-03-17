import { BuyForm } from "./BuyForm"
import { TokenSymbol } from "./TokenSymbol"
import { ProjectHardcap } from "./ProjectHardcap"
import { ProjectDateEnd } from "./ProjectDateEnd"
import { ProjectDateStart } from "./ProjectDateStart"
import { ProjectMaxTokenBuy } from "./ProjectMaxTokenBuy"
import { ProjectProgressBar } from "./ProjectProgressBar"
import { ProjectMaxTokenBuyEth } from "./ProjectMaxTokenBuyEth"
import { ProjectPurchasedAmount } from "./ProjectPurchasedAmount"

import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function BuyCard() {
    return (
        <Card className="bg-black">
            <CardHeader>
                <CardTitle>
                    Purchase tokens
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <span>From <ProjectDateStart /></span>
                    <span>To <ProjectDateEnd /></span>
                </div>
                <Separator className="my-4" />
                <div>
                    <ProjectMaxTokenBuy /> <TokenSymbol /> = <ProjectMaxTokenBuyEth /> $ETH
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="muted">Total purchased</span>
                        <span className="muted">Hardcap</span>
                    </div>
                    <div className="flex justify-between">
                        <ProjectPurchasedAmount />
                        <span><ProjectHardcap /> <TokenSymbol /></span>
                    </div>
                    <ProjectProgressBar />
                </div>
                <Separator className="my-4" />
                <BuyForm />
            </CardContent>
        </Card>
    )
}

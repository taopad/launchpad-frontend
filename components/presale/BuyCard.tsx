import { BuyForm } from "./BuyForm"
import { TokenSymbol } from "./TokenSymbol"
import { PresaleHardcap } from "./PresaleHardcap"
import { PresaleDateEnd } from "./PresaleDateEnd"
import { PresaleDateStart } from "./PresaleDateStart"
import { PresaleMaxTokenBuy } from "./PresaleMaxTokenBuy"
import { PresaleProgressBar } from "./PresaleProgressBar"
import { PresaleMaxTokenBuyEth } from "./PresaleMaxTokenBuyEth"
import { PresalePurchasedAmount } from "./PresalePurchasedAmount"

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
                    <span>From <PresaleDateStart /></span>
                    <span>To <PresaleDateEnd /></span>
                </div>
                <Separator className="my-4" />
                <div>
                    <PresaleMaxTokenBuy /> <TokenSymbol /> = <PresaleMaxTokenBuyEth /> $ETH
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="muted">Total purchased</span>
                        <span className="muted">Hardcap</span>
                    </div>
                    <div className="flex justify-between">
                        <PresalePurchasedAmount />
                        <span><PresaleHardcap /> <TokenSymbol /></span>
                    </div>
                    <PresaleProgressBar />
                </div>
                <Separator className="my-4" />
                <BuyForm />
            </CardContent>
        </Card>
    )
}

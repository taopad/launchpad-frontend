import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { WalletProvider } from "@/components/WalletProvider"
import { BuyCard } from "@/components/presale/BuyCard"
import { ClaimCard } from "@/components/presale/ClaimCard"
import { ProjectName } from "@/components/presale/ProjectName"
import { TokenSymbol } from "@/components/presale/TokenSymbol"
import { ProjectProvider } from "@/components/presale/ProjectProvider"
import { ProjectCoverImage } from "@/components/presale/ProjectCoverImage"
import { ProjectDescription } from "@/components/presale/ProjectDescription"
import { ProjectTokenAddress } from "@/components/presale/ProjectTokenAddress"
import { ProjectWhitelistAlert } from "@/components/presale/ProjectWhitelistAlert"

export default function Launchpad({ params: { chain_id, address } }: { params: { chain_id: string, address: `0x${string}` } }) {
    const chainId = parseInt(chain_id)

    if (isNaN(chainId)) {
        return notFound()
    }

    const cookie = headers().get("cookie")

    return (
        <WalletProvider chainId={chainId} cookie={cookie}>
            <ProjectProvider chainId={chainId} address={address}>
                <div className="flex flex-col gap-8">
                    <Navbar />
                    <div className="flex flex-col gap-8 px-8 max-w-[1024px] w-full mx-auto">
                        <ProjectCoverImage />
                        <h1><ProjectName /></h1>
                        <ProjectDescription />
                        <p className="flex gap-2">
                            <span><TokenSymbol /> contract address:</span> <ProjectTokenAddress />
                        </p>
                        <ProjectWhitelistAlert />
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <BuyCard />
                            </div>
                            <div className="flex-1">
                                <ClaimCard />
                            </div>
                        </div>
                    </div>
                </div>
            </ProjectProvider>
        </WalletProvider>
    )
}

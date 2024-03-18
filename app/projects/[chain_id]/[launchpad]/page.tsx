import { isAddress } from "viem"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { WalletProvider } from "@/components/WalletProvider"
import { ProjectCoverImage } from "@/components/ProjectCoverImage"
import { ProjectDescription } from "@/components/ProjectDescription"
import { BuyCard } from "@/components/presale/BuyCard"
import { ClaimCard } from "@/components/presale/ClaimCard"
import { PresaleName } from "@/components/presale/PresaleName"
import { TokenSymbol } from "@/components/presale/TokenSymbol"
import { PresaleTokenAddress } from "@/components/presale/PresaleTokenAddress"
import { PresaleWhitelistAlert } from "@/components/presale/PresaleWhitelistAlert"
import { PresaleContractProvider } from "@/components/presale/PresaleContractProvider"
import { PresaleWhitelistProvider } from "@/components/presale/PresaleWhitelistProvider"
import { fetchProjectData } from "@/queries/fetchProjectData"
import { fetchWhitelistData } from "@/queries/fetchWhitelistData"

type Params = {
    chain_id: string
    launchpad: string
}

const fetchPageData = async (chainId: number, launchpad: `0x${string}`) => {
    const [[coverImageUrl, description], whitelist] = await Promise.all([
        fetchProjectData(chainId, launchpad),
        fetchWhitelistData(chainId, launchpad),
    ])

    return {
        coverImageUrl,
        description,
        whitelist,
    }
}

export default async function Launchpad({ params: { chain_id, launchpad } }: { params: Params }) {
    const chainId = parseInt(chain_id)

    if (isNaN(chainId)) {
        return notFound()
    }

    if (!isAddress(launchpad)) {
        return notFound()
    }

    const cookie = headers().get("cookie")
    const { coverImageUrl, description, whitelist } = await fetchPageData(chainId, launchpad)

    return (
        <WalletProvider chainId={chainId} cookie={cookie}>
            <PresaleContractProvider chainId={chainId} address={launchpad}>
                <PresaleWhitelistProvider {...whitelist}>
                    <div className="flex flex-col gap-8">
                        <Navbar />
                        <div className="flex flex-col gap-8 px-8 max-w-[1024px] w-full mx-auto">
                            <ProjectCoverImage url={coverImageUrl} />
                            <ProjectDescription>{description}</ProjectDescription>
                            <h1><PresaleName /></h1>
                            <p className="flex gap-2">
                                <span><TokenSymbol /> contract address:</span> <PresaleTokenAddress />
                            </p>
                            <PresaleWhitelistAlert />
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
                </PresaleWhitelistProvider>
            </PresaleContractProvider>
        </WalletProvider>
    )
}

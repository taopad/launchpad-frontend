import prisma from "@/db"
import { isAddress } from "viem"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { WalletProvider } from "@/components/WalletProvider"
import { ProjectCoverImage } from "@/components/ProjectCoverImage"
import { ProjectDescription } from "@/components/ProjectDescription"
import { BuyCard } from "@/components/presale/BuyCard"
import { ClaimCard } from "@/components/presale/ClaimCard"
import { ProjectName } from "@/components/presale/ProjectName"
import { TokenSymbol } from "@/components/presale/TokenSymbol"
import { PresaleContractProvider } from "@/components/presale/PresaleContractProvider"
import { ProjectTokenAddress } from "@/components/presale/ProjectTokenAddress"
import { ProjectWhitelistAlert } from "@/components/presale/ProjectWhitelistAlert"
import { PresaleWhitelistProvider } from "@/components/presale/PresaleWhitelistProvider"

type Params = {
    chain_id: string
    launchpad: string
}

const getProjectCoverImage = async (chainId: number, launchpad: `0x${string}`) => {
    const url = `https://raw.githubusercontent.com/taopad/launchpad-metadata/master/${chainId}/${launchpad}/cover.png`

    const response = await fetch(url, { method: "HEAD" })

    if (response.status === 200) {
        return url
    }
}

const getProjectDescription = async (chainId: number, launchpad: `0x${string}`) => {
    const url = `https://raw.githubusercontent.com/taopad/launchpad-metadata/master/${chainId}/${launchpad}/description.md`

    const response = await fetch(url)

    if (response.status === 200) {
        return await response.text()
    }
}

const getProjectData = async (chainId: number, launchpad: `0x${string}`) => {
    return Promise.all([
        getProjectCoverImage(chainId, launchpad),
        getProjectDescription(chainId, launchpad),
    ])
}

const getWhitelistData = async (chainId: number, launchpad: `0x${string}`) => {
    const result = await prisma.whitelists.findFirst({
        select: {
            block_number: true,
            min_balance: true,
            root: true,
        },
        where: {
            chain_id: { equals: chainId },
            launchpad: { equals: launchpad, mode: "insensitive" },
        },
    })

    return {
        blockNumber: result?.block_number.toString(),
        minBalance: result?.min_balance,
        root: result ? result.root as `0x${string}` : undefined,
    }
}

const fetchPresaleData = async (chainId: number, launchpad: `0x${string}`) => {
    const results = await Promise.all([
        getProjectData(chainId, launchpad),
        getWhitelistData(chainId, launchpad),
    ])

    const [coverImageUrl, description] = results[0]
    const whitelist = results[1]

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
    const { coverImageUrl, description, whitelist } = await fetchPresaleData(chainId, launchpad)

    return (
        <WalletProvider chainId={chainId} cookie={cookie}>
            <PresaleContractProvider chainId={chainId} address={launchpad}>
                <PresaleWhitelistProvider {...whitelist}>
                    <div className="flex flex-col gap-8">
                        <Navbar />
                        <div className="flex flex-col gap-8 px-8 max-w-[1024px] w-full mx-auto">
                            <ProjectCoverImage url={coverImageUrl} />
                            <h1><ProjectName /></h1>
                            <ProjectDescription>{description}</ProjectDescription>
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
                </PresaleWhitelistProvider>
            </PresaleContractProvider>
        </WalletProvider>
    )
}

import Link from "next/link"
import { headers } from "next/headers"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletProvider } from "@/components/WalletProvider"
import { ProjectCoverImage } from "@/components/ProjectCoverImage"
import { PresaleName } from "@/components/presale/PresaleName"
import { PresaleTokenAddress } from "@/components/presale/PresaleTokenAddress"
import { PresaleContractProvider } from "@/components/presale/PresaleContractProvider"
import { fetchProjectData } from "@/queries/fetchProjectData"

const presales = [
    { chainId: 1, address: "0x116Bb71512f8E9f76Df2840C7CED2B5Ee06f9C85" as `0x${string}`, minBalance: 1000 },
    { chainId: 1, address: "0x481dacbf63363d142d761C6DE51da05F10A2b70D" as `0x${string}`, minBalance: 50 },
]

export default async function Home() {
    const cookie = headers().get("cookie")

    const [coverImageUrl] = await fetchProjectData(presales[0].chainId, presales[0].address)

    return (
        <WalletProvider cookie={cookie}>
            <div className="flex flex-col gap-8">
                <Navbar />
                <div className="flex flex-col gap-8 px-8 max-w-[1024px] w-full mx-auto">
                    <ProjectCoverImage url={coverImageUrl} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {presales.map(({ chainId, address, minBalance }, i) => (
                            <PresaleContractProvider key={i} chainId={chainId} address={address}>
                                <Card className="border p-7 bg-black shadow-lg rounded-lg">
                                    <h2 className="text-3xl text-white font-bold mb-3">
                                        <PresaleName />
                                    </h2>
                                    <p className="text-base mb-4 border-b pb-4 flex gap-2">
                                        <span>Address:</span> <PresaleTokenAddress />
                                    </p>
                                    <Button variant="secondary" className="w-full no-underline" asChild>
                                        <Link href={`/projects/${chainId}/${address}`} target="_blank">
                                            <span><PresaleName /> ({minBalance}+ $TPAD)</span>
                                        </Link>
                                    </Button>
                                </Card>
                            </PresaleContractProvider>
                        ))}
                    </div>
                </div>
            </div>
        </WalletProvider>
    )
}

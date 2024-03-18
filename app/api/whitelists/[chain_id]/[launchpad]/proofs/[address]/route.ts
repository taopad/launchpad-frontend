import prisma from "@/db"
import { notFound } from "next/navigation"
import { isAddress } from "viem"

type Params = {
    chain_id: string
    launchpad: string
    address: string
}

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params: { chain_id, launchpad, address } }: { params: Params }) {
    const chainId = parseInt(chain_id)

    if (isNaN(chainId)) {
        return notFound()
    }

    if (!isAddress(launchpad)) {
        return notFound()
    }

    if (!isAddress(address)) {
        return notFound()
    }

    const result = await prisma.whitelists_proofs.findFirst({
        select: {
            proof: true,
        },
        where: {
            chain_id: { equals: chainId },
            launchpad: { equals: launchpad, mode: "insensitive" },
            address: { equals: address, mode: "insensitive" },
        },
    })

    return Response.json({
        proof: (result?.proof ?? []) as `0x${string}`[],
    })
}

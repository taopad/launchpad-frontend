import prisma from "@/db"
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
        return Response.error()
    }

    if (!isAddress(launchpad)) {
        return Response.error()
    }

    if (!isAddress(address)) {
        return Response.error()
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

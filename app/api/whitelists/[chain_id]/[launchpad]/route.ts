import prisma from "@/db"
import { isAddress } from "viem"

type Params = {
    chain_id: string
    launchpad: string
}

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params: { chain_id, launchpad } }: { params: Params }) {
    const chainId = parseInt(chain_id)

    if (isNaN(chainId)) {
        return Response.error()
    }

    if (!isAddress(launchpad)) {
        return Response.error()
    }

    const result = await prisma.whitelists.findFirst({
        select: {
            block_number: true,
            min_balance: true,
        },
        where: {
            chain_id: { equals: chainId },
            launchpad: { equals: launchpad, mode: "insensitive" },
        },
    })

    if (result === null) {
        return Response.error()
    }

    return Response.json({
        block_number: result.block_number.toString(),
        min_balance: result.min_balance
    })
}

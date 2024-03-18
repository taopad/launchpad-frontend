import prisma from "@/db"

export const fetchWhitelistData = async (chainId: number, launchpad: `0x${string}`) => {
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

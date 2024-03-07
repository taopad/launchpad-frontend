import { useReadContracts } from "wagmi"
import { useContract } from "./useContract"
import abi from "@/config/abi/LaunchpadAbi"

export function useProjectStaticData() {
    const contract = useContract()

    return useReadContracts({
        allowFailure: false,
        contracts: [
            {
                abi,
                ...contract,
                functionName: "name",
            },
            {
                abi,
                ...contract,
                functionName: "startDate",
            },
            {
                abi,
                ...contract,
                functionName: "endDate",
            },
            {
                abi,
                ...contract,
                functionName: "releaseDelay",
            },
            {
                abi,
                ...contract,
                functionName: "token",
            },
            {
                abi,
                ...contract,
                functionName: "minTokenBuy",
            },
            {
                abi,
                ...contract,
                functionName: "maxTokenBuy",
            },
        ],
        query: {
            select: (data) => ({
                name: data[0],
                startDate: data[1],
                endDate: data[2],
                releaseDelay: data[3],
                token: data[4],
                minTokenBuy: data[5],
                maxTokenBuy: data[6],
            }),
        },
    })
}

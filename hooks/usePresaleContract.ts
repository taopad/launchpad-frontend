import { useContext } from "react"
import { PresaleContractContext } from "@/components/presale/PresaleContractProvider"

export function usePresaleContract() {
    return useContext(PresaleContractContext)
}

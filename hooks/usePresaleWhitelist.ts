import { useContext } from "react"
import { PresaleWhitelistContext } from "@/components/presale/PresaleWhitelistProvider"

export function usePresaleWhitelist() {
    return useContext(PresaleWhitelistContext)
}

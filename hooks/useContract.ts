import { useContext } from "react"
import { ProjectContext } from "@/components/presale/ProjectProvider"

export function useContract() {
    return useContext(ProjectContext)
}

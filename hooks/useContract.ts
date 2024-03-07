import { useContext } from "react"
import { ProjectContext } from "@/components/ProjectProvider"

export function useContract() {
    return useContext(ProjectContext)
}

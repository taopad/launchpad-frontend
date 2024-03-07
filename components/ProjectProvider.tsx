"use client"

import { createContext } from "react"

type ProjectState = {
    chainId: number | undefined
    address: `0x${string}` | undefined
}

export const ProjectContext = createContext<ProjectState>({
    chainId: undefined,
    address: undefined,
})

export function ProjectProvider({ chainId, address, children }: { chainId: number, address: `0x${string}`, children: React.ReactNode }) {
    return (
        <ProjectContext.Provider value={{ chainId, address }}>
            {children}
        </ProjectContext.Provider>
    )
}

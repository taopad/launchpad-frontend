"use client"

import Markdown from "react-markdown"

export function ProjectDescription({ children }: { children: string | undefined }) {
    if (children === undefined) {
        return null
    }

    return <Markdown>{children}</Markdown>
}

"use client"

import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function ProjectCoverImage({ url }: { url: string | undefined }) {
    if (url === undefined) {
        return null
    }

    return (
        <AspectRatio ratio={16 / 4}>
            <Image src={url} alt="project cover" fill priority={true} />
        </AspectRatio>
    )
}

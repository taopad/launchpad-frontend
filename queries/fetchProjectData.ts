const fetchProjectCoverImage = async (chainId: number, launchpad: `0x${string}`) => {
    const url = `https://raw.githubusercontent.com/taopad/launchpad-metadata/master/${chainId}/${launchpad}/cover.png`

    const response = await fetch(url, { method: "HEAD" })

    if (response.status === 200) {
        return url
    }
}

const fetchProjectDescription = async (chainId: number, launchpad: `0x${string}`) => {
    const url = `https://raw.githubusercontent.com/taopad/launchpad-metadata/master/${chainId}/${launchpad}/description.md`

    const response = await fetch(url)

    if (response.status === 200) {
        return await response.text()
    }
}

export const fetchProjectData = async (chainId: number, launchpad: `0x${string}`) => {
    return Promise.all([
        fetchProjectCoverImage(chainId, launchpad),
        fetchProjectDescription(chainId, launchpad),
    ])
}

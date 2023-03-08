export async function downloadAsset(assetUrl: string) {
  const response = await fetch(new Request(assetUrl))

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.text()
}

export async function downloadAssetList(assetUrls: string[]) {
  return await Promise.all(assetUrls.map(url => downloadAsset(url)))
}
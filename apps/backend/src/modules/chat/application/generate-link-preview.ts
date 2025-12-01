// TODO: Implement link preview generation
// This would require a service to fetch URL metadata (og:tags, etc)
// For now, returning a simple response

export type GenerateLinkPreviewData = {
  url: string
}

export const makeGenerateLinkPreview = () => async (data: GenerateLinkPreviewData) => ({
  url: data.url,
  title: undefined,
  description: undefined,
  image: undefined,
  siteName: undefined,
})

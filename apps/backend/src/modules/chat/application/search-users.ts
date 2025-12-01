// TODO: Implement user search - requires integration with Identity module
// This would search users in the identity.users table
// For now, returning empty results

export const makeSearchUsers =
  () =>
  async (_query: string, _page = 1, _limit = 20) => ({
    data: [],
    meta: { total: 0, page: _page, limit: _limit, pages: 0 },
  })

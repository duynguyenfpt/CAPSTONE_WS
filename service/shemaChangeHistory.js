import { http } from './common'

export const searchDB = (page, limit, textSearch) => http.get('api/database_infors', {
  params: {
    page: page,
    limit: limit,
    keyword: textSearch
  }
})

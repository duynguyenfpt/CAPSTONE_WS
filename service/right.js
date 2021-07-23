import { http } from './common'

export const getList = (page, limit) => http.get('api/rights', { params: { page, limit } })
export const getAll =
    () => http.get('api/rights', {
      params: {
        page: 1,
        limit: 1000
      }
    })
export const deleteRight = (id) => http.delete(`api/rights/${id}`)

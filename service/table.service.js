import { http } from './common'

export const getTableDetail = (id) => http.get(`api/tables/${id}`)
export const deleteTableDetail = (id) => http.delete(`api/tables/${id}`)
export const getListTable = (page, limit) => http.get('api/tables', { params: { page, limit } })
export function addTable (request) {
  return http.post('api/tables', request)
}

export const createTable = (tb) => http.post('api/tables', tb)

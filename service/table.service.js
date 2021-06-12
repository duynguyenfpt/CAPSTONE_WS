import { http } from './common'

export const getTableDetail = (id) => http.get(`api/tables/${id}`)
export const deleteTableDetail = (id) => http.delete(`api/tables/${id}`)
export function addTable (request) {
  return http.post('api/tables', request)
}

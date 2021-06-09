import { http } from './common'

export const getTableDetail = (id) => http.get(`api/tables/${id}`)
export const deleteTableDetail = (id) => http.delete(`api/tables/${id}`)
// export const createTable = (createDbRequest) => http.post('api/tables', createDbRequest)

export function addTable (request) {
  return http.post('api/tables', request)
}

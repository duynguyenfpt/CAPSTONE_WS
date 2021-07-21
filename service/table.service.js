import { http } from './common'

export const getTableDetail = (id) => http.get(`api/tables/${id}`)
export const deleteTableDetail = (id) => http.delete(`api/tables/${id}`)
export const getListTable = (page, limit) => http.get('api/tables', { params: { page, limit } })
export function addTable (request) {
  return http.post('api/tables', request)
}

export const createTable = (tb) => http.post('api/tables', tb)
export const getAllTableByDb = (db, page, limit) => http.get(`api/database_infors/${db}/tables`, { params: { page, limit } })
export const getTableSchema = (id) => http.get(`api/tables/${id}/current_table_schemas`, { params: { page: 1, limit: 100 } })
export const getTableByDb = (db, page, limit) => http.get(`api/database_infors/${db}/tables`, { params: { page, limit } })
export const getSchemaByTableId = (id, page, limit) => http.get(`api/tables/${id}/current_table_schemas`, { params: { page, limit } })
export const getColumnByTable = (id) => http.get(`api/tables/${id}/columns`, { id })

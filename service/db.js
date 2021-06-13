import { http } from './common'

export const getAllDbType =
    () => http.get('api/database_infors', {
      params: {
        page: 1,
        limit: 1000
      }
    })

export const getDatabaseDetail = (id) => http.get(`api/database_infors/${id}`)
export const deleteDatabaseDetail = (id) => http.delete(`api/database_infors/${id}`)
export const getListDatabase =
  (page, limit) => http.get('api/database_infors', { params: { page, limit } })

export const createDatabase = (db) => http.post('api/database_infors', db)

export const updateDatabase = (id, data) => http.put(`api/database_infors/${id}`, data)
export const checkConnection = (db) => http.post('api/database_infors/test_connection', db)

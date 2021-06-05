import { http } from './common'

export const getAllDbType =
    () => http.get('category', {
      params: {
        page: 1,
        limit: 1000
      }
    })

export const getDatabaseDetail = (id) => http.get(`api/database_infors/${id}`)

export const getListDatabase =
  (page, limit) => http.get('api/database_infors', { params: { page, limit } })

export const createDatabase = (db) => http.post('api/database_infors', db)

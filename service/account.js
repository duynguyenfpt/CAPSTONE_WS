import { http } from './common'

export const getListAccount = (page, limit) => http.get('api/accounts', { params: { page, limit } })
export const getAllAccount =
    () => http.get('api/accounts', {
      params: {
        page: 1,
        limit: 1000
      }
    })
export const updateAccount = (id, data) => http.put(`api/accounts/${id}`, data)
export const getAccountDetail = (id) => http.get(`api/accounts/${id}`)

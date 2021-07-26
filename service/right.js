import { http } from './common'

export const getList = (page, limit) => http.get('api/rights', { params: { page, limit } })
export const getAll =
    () => http.get('api/rights', {
      params: {
        page: 1,
        limit: 1000
      }
    })
export const createRight = (data) => http.post('api/rights/', data)
export const createRightForAcc = (data) => http.post('api/account_rights', data)
export const deleteRightForAcc = (id, data) => http.delete(`api/accounts/${id}/account_rights`, { data: data })
export const getRightByAcc = (id, page, limit) => http.get(`api/accounts/${id}/rights`, { params: { page, limit } })
export const getAllRightByAcc = (id) => http.get(`api/accounts/${id}/rights`, { params: { page: 1, limit: 100 } })

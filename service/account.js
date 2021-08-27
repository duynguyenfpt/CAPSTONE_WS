import { http } from './common'

export const getListAccount = (page, limit) => http.get('api/accounts', { params: { page, limit } })
export const getAllAccount =
    () => http.get('api/accounts', {
      params: {
        page: 1,
        limit: 1000
      }
    })
export const getAccounts =
    () => http.get('api/list_account', {
      params: {
        page: 1,
        limit: 1000
      }
    })
export const updateAccount = (id, data) => http.put(`api/accounts/${id}`, data)
export const getAccountDetail = (id) => http.get(`api/accounts/${id}`)
export const createAccount = (data) => http.post('api/accounts/', data)
export const resetAccount = (id) => http.post(`api/accounts/${id}/reset_password`)
export const getMe = () => http.get('api/me')
export const searchAccount = (page, limit, textSearch) => http.get('api/accounts', {
  params: {
    page: page,
    limit: limit,
    keyword: textSearch
  }
})
export const activeAccount = (id, data) => http.put(`api/accounts/${id}`, data)
export const deactiveAccount = (id, data) => http.put(`api/accounts/${id}`, data)
export const forgotPassword = (username) => http.get('api/accounts/forgot_password', { params: { username } })

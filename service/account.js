import { http } from './common'

export const getListAccount = (page, limit) => http.get('api/accounts', { params: { page, limit } })

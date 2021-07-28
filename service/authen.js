import { http } from './common'

export const login = (data) => http.post('api/authenticate', data)
export const changePassword = (data) => http.post('api/change_password', data)

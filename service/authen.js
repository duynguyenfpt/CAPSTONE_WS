import { http } from './common'

export const login = (data) => http.post('api/authenticate', data)

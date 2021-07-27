import { http } from './common'

export const getAllLog =
  (page, limit) => http.get('api/action_logs', { params: { page, limit } })

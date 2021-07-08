import { http } from './common'

export const getListJob =
  (page, limit) => http.get('api/jobs', { params: { page, limit } })
export const createJob = (data) => http.post('api/jobs', data)

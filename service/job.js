import { http } from './common'

export const getListJob =
  (page, limit) => http.get('api/jobs', { params: { page, limit } })
export const createJob = (data) => http.post('api/jobs', data)
export const getDetailJob = (id) => http.get(`api/jobs/${id}`)
export const getLogByJob = (id, page, limit) => http.get(`api/jobs/${id}/job_logs`, { params: { page, limit } })

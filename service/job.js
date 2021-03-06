import { http } from './common'

export const getListJob =
  (page, limit) => http.get('api/jobs', { params: { page, limit } })
export const createJob = (data) => http.post('api/jobs', data)
export const updateJob = (id, data) => http.put(`api/jobs/${id}`, data)
export const getDetailJob = (id) => http.get(`api/jobs/${id}`)
export const getLogByJob = (id, page, limit) => http.get(`api/jobs/${id}/job_logs`, { params: { page, limit } })
export const getLastJobLog = (id) => http.get(`api/jobs/${id}/last_job_log`)
export const getJobDetail = (id) => http.get(`api/jobs/${id}/job_detail`)
export const searchJob = (page, limit, textSearch) => http.get('api/jobs', {
  params: {
    page: page,
    limit: limit,
    keyword: textSearch
  }
})
export const getAllJobLog =
  (page, limit) => http.get('api/job_logs', { params: { page, limit } })
export const resetJob = (id) => http.post(`api/jobs/${id}/reset_job`)

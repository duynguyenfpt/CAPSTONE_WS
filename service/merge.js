import { http } from './common'

export const createMerge = (data) => http.post('api/merge_requests', data)
export const getMerge = (id) => http.get(`api/requests/${id}/merge_requests`)
export const updateMerge = (id, data) => http.put(`api/requests/${id}/merge_requests`, data)

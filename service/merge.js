import { http } from './common'

export const createMerge = (data) => http.post('api/merge_requests', data)
export const getMerge = (id) => http.get(`api/requests/${id}/merge_requests`)

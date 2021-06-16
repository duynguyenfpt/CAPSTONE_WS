import { http } from './common'

export const getRequest = (page, limit) => http.get('api/requests', { params: { page, limit } })
export const deleteRequest = (id) => http.delete(`api/requests/${id}`)
export const getDetailRequest = (id) => http.get(`api/requests/${id}`)
export const createRequest = (requests) => http.post('api/requests', requests)
export const updateRequest = (id, requests) => http.put(`api/requests/${id}`, requests)

export const createRequestSync = (request) => http.post('api/sync_table_requests', request)

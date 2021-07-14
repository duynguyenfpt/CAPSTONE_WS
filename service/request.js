import { http } from './common'

export const getRequest = (page, limit) => http.get('api/requests', { params: { page, limit } })
export const deleteRequest = (id) => http.delete(`api/requests/${id}`)
export const getDetailRequest = (id) => http.get(`api/requests/${id}`)
export const createRequest = (requests) => http.post('api/requests', requests)
export const updateRequest = (id, requests) => http.put(`api/requests/${id}`, requests)

export const createRequestSync = (request) => http.post('api/requests', request)
export const createRequestAddColumn = (request) => http.post('api/requests', request)
export const getAllRequest = (page, limit) => http.get('api/requests', { params: { page: 1, limit: 100 } })

export const getLogByRequest = (id) => http.get(`api/requests/${id}/notes`, { params: { page: 1, limit: 100 } })
export const createLog = (data) => http.post('api/notes', data)

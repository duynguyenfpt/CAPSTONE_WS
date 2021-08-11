import { http } from './common'

export const getResultDetail = (id) => http.get(`api/request/${id}/etl_requests`)
export const getAllResults = () => http.get('api/etl_requests?page=1&limit=100')
export const shareEtl = (data) => http.post('api/etl_requests/share', data)
export const createEtl = (data) => http.post('api/etl_requests', data)
export const downloadData = (id) => http.get(`api/requests/${id}/etl_request/dowload_csv`)

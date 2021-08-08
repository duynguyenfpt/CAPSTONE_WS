import { http } from './common'

export const getResultDetail = (id) => http.get(`api/request/${id}/etl_requests`)
export const getAllResults = () => http.get('api/etl_requests?page=1&limit=100')
export const shareEtl = (data) => http.post('api/etl_requests/share', data)

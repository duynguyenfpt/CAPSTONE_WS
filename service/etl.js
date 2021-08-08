import { http } from './common'

export const getResultDetail = (id) => http.get(`api/request/${id}/etl_requests`)

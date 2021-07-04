import { http } from './common'

export const getAllServers =
    () => http.get('api/server_infors', {
      params: {
        page: 1,
        limit: 1000
      }
    })

export const getListServer = (page, limit) => http.get('api/server_infors', { params: { page, limit } })
export const getServer = (id) => http.get(`api/server_infors/${id}`)
export const updateServer = (id, data) => http.put(`api/server_infors/${id}`, data)
export const createServer = (data) => http.post('api/server_infors', data)
export const deleteServer = (id) => http.delete(`api/server_infors/${id}`)

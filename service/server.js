import { http } from './common'

export const getAllServers =
    () => http.get('api/server_infors', {
      params: {
        page: 1,
        limit: 1000
      }
    })

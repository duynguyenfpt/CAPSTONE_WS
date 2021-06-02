import { service } from './common'

export const getNews = (page, limit) =>
  service({
    url: `/new?page=${page}&limit=${limit}`,
    method: 'get'
  })

export const getNewDetail = (id) =>
  service({
    url: `/new?id=${id}`,
    method: 'get'
  })

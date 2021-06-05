import { http } from './common'

export const getNews = (page, limit) => http.get('new', { params: { page: page, limit: limit } })

export const getNewDetail = (id) =>
  http({
    url: `/new/${id}`,
    method: 'get'
  })

export const createNew = (data) =>
  http({
    url: '/new',
    data: data,
    method: 'post'
  })

export const updateNew = (id, data) =>
  http({
    url: `/new/${id}`,
    data: data,
    method: 'put'
  })

export const deleteNew = (data) =>
  http({
    url: '/new',
    data: data,
    method: 'delete'
  })

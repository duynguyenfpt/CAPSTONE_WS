import { service } from './common'

export const getNews = (page, limit) => service.get('new', { params: { page: page, limit: limit } })

export const getNewDetail = (id) =>
  service({
    url: `/new/${id}`,
    method: 'get'
  })

export const createNew = (data) =>
  service({
    url: '/new',
    data: data,
    method: 'post'
  })

export const updateNew = (id, data) =>
  service({
    url: `/new/${id}`,
    data: data,
    method: 'put'
  })

export const deleteNew = (data) =>
  service({
    url: '/new',
    data: data,
    method: 'delete'
  })

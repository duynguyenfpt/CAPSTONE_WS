import { http } from './common'

export const getAllLog =
  (page, limit) => http.get('api/action_logs', { params: { page, limit } })

export const searchLog = (page, limit, userName, fromDate, toDate) => http.get('api/action_logs', {
  params: {
    page: page,
    limit: limit,
    userName: userName,
    fromDate: fromDate,
    toDate: toDate
  }
})

import { http } from './common'

export const getAllLog =
  (page, limit) => http.get('api/action_logs', { params: { page, limit } })

export const searchLog = (page, limit, username, fromDate, toDate) => http.get('api/action_logs', {
  params: {
    page: page,
    limit: limit,
    username: username,
    startDate: fromDate,
    endDate: toDate
  }
})

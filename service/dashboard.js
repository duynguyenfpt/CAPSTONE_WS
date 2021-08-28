import { http } from './common'

export const getDashboardRequest = () => http.get('api/dashboard/statistic_request')

const date = new Date()
const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

export const getDashboardJob = () => http.get('api/dashboard/statistic_percent_job', { params: { startDate: '2021-7-1', endDate: today } })

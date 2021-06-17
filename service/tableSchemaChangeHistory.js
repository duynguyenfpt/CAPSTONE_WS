import { http } from './common'

export const getAllChangeHistory = (page, limit) => http.get('api/schema_change_history', { params: { page, limit } })

export const filterByTableIdAndTypeChange = (tableId, page, limit, typeChange) => http.get('api/schema_change_history/search',
  { params: { tableId, page, limit, typeChange } }
)

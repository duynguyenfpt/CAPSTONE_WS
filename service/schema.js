import { http } from './common'

export const getSchemaById = (id) => http.get(`api/current_table_schemas/${id}`)

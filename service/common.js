import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.BASE_URL_APP_API_V1
})

// Request interceptors
http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    Promise.reject(error)
    throw error
  }
)

import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.BASE_URL_APP_API_V1
})

// Request interceptors
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
    const statusCode = error.response.data.status
    if (statusCode === 401 || statusCode === '401') {
      window.location.href = '/login'
    }
    if (error.message.includes('403')) {
      return {
        statusCode: '403',
        message: 'Access denied'
      }
    }
    if (error.message.includes('422')) {
      return {
        statusCode: '422',
        message: 'Can not add rights for yourself'
      }
    }
  }
)

import axios from 'axios'

export const service = axios.create({
  baseURL: process.env.BASE_URL_APP_API_V1 || 'https://e3074465f385.ngrok.io'
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.log(error)
  }
)

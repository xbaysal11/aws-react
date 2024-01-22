import axios from 'axios'
import { getUser } from '@/utils/auth'
const API = axios.create({})

API.interceptors.request.use((config) => {
  const user = getUser()

  if (user) {
    config.headers['Authorization'] = `${user.token}`
  }
  return config
})

export default API

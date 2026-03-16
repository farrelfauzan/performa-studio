import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from 'axios'
import { toast } from 'sonner'
import { config } from './config'
import { useAuthStore } from '@/stores/auth-store'

export interface TypedAxiosInstance extends AxiosInstance {
  get<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>
  delete<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>
  post<T = any, R = T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>
  put<T = any, R = T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>
  patch<T = any, R = T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>
}

const axiosConfig: CreateAxiosDefaults = {
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: (params: Record<string, any>) => {
      const searchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === 'status' && value.length > 0) {
            searchParams.append(key, value.join(','))
          } else {
            value.forEach((item) => {
              if (item !== undefined && item !== null) {
                searchParams.append(key, String(item))
              }
            })
          }
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })

      return searchParams.toString()
    },
  },
}

export const apiClient: TypedAxiosInstance = axios.create(axiosConfig)

// Request interceptor
apiClient.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token

    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`
    }

    return reqConfig
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError<any>) => {
    const errorData = error.response?.data

    if (error.response?.status === 401) {
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        window.location.pathname !== '/'
      ) {
        useAuthStore.getState().logout()
        delete apiClient.defaults.headers.common['Authorization']
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
    }

    if (errorData?.message) {
      toast.error(errorData.message)
    } else if (error.message) {
      toast.error(error.message)
    } else {
      toast.error('An error occurred. Please try again.')
    }

    return Promise.reject(error)
  },
)

export default apiClient

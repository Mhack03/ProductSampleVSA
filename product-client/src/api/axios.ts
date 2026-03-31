import axios from 'axios'

/**
 * We create a custom Axios instance instead of using axios directly.
 * This lets us set a base URL, default headers, and interceptors
 * in one place — every API call in the project inherits these settings.
 */
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  // Backend API may run in HTTP mode for local development on 5012.
  // Update .env as needed with VITE_API_BASE_URL if you use HTTPS on 7245.
  'http://localhost:5012/api'

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * REQUEST INTERCEPTOR
 * Runs before every outgoing request.
 * Perfect place to attach auth tokens (JWT) when you add authentication.
 *
 * Example: config.headers.Authorization = `Bearer ${token}`
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: attach JWT token here when auth is implemented
    return config
  },
  (error) => Promise.reject(error),
)

/**
 * RESPONSE INTERCEPTOR
 * Runs after every response comes back from the server.
 * 
 * onFulfilled: runs on 2xx responses — just pass the response through.
 * onRejected: runs on error responses (4xx, 5xx).
 *   We extract the ProblemDetails from your .NET API's error response
 *   and throw a clean, readable error.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Your .NET API returns RFC 9457 ProblemDetails on errors
    const message =
      error.response?.data?.detail ??
      error.response?.data?.title ??
      error.message ??
      'An unexpected error occurred'

    // Return a clean error with the message from ProblemDetails
    return Promise.reject(new Error(message))
  },
)

export default apiClient
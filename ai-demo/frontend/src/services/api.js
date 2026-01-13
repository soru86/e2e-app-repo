import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // 10 minutes for large codebases
  headers: {
    'Content-Type': 'application/json',
  },
})

export const analyzeZipFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/analyze/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const analyzeGitHubUrl = async (url) => {
  const response = await api.post('/analyze/github', null, {
    params: { url },
  })

  return response.data
}

export const checkHealth = async () => {
  const response = await api.get('/analyze/health')
  return response.data
}

export default api


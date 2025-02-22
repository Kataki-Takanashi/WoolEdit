import { getModels, setConnectionConfig } from './ollamaService'

export const checkOllamaConnection = async () => {
  try {
    // Try local connection first without any saved credentials
    setConnectionConfig('http://localhost:11434', '')
    
    try {
      const localModels = await getModels()
      if (Array.isArray(localModels) && localModels.length > 0) {
        return {
          isConnected: true,
          models: localModels,
          error: null
        }
      }
    } catch (localError) {
      // If local connection fails, try with saved credentials
      const savedUrl = localStorage.getItem('ollamaUrl')
      const savedToken = localStorage.getItem('ollamaToken')
      
      if (savedUrl) {
        setConnectionConfig(savedUrl, savedToken || '')
        const models = await getModels()
        return {
          isConnected: Array.isArray(models) && models.length > 0,
          models: models,
          error: null
        }
      }
    }
    
    throw new Error('Could not establish connection')
  } catch (error) {
    console.error('Connection check failed:', error)
    let errorMessage = 'Connection failed'
    
    if (error.message.includes('401')) {
      errorMessage = 'Authentication failed. Please check your API token.'
    } else if (error.message.includes('CORS') || error.message.includes('access control')) {
      errorMessage = 'CORS error. Make sure CORS is enabled on the server.'
    } else if (error.message.includes('Load failed')) {
      errorMessage = 'Could not reach the server. Please check the URL and ensure the server is running.'
    }

    return {
      isConnected: false,
      models: [],
      error: errorMessage
    }
  }
}

export const loadModels = async () => {
  const { isConnected, models, error } = await checkOllamaConnection()
  return {
    isConnected,
    models: isConnected ? models : [],
    error
  }
}
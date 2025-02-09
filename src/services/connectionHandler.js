import { getModels } from './ollamaService'

export const checkOllamaConnection = async () => {
  try {
    const models = await getModels()
    return {
      isConnected: Array.isArray(models) && models.length > 0,
      models: models,
      error: null
    }
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
import { getModels } from './ollamaService'

export const checkOllamaConnection = async () => {
  try {
    console.log('Starting connection check...')
    const models = await getModels()
    console.log('Connection check result:', { models })
    return {
      isConnected: Array.isArray(models) && models.length > 0,
      models: models,
      error: null
    }
  } catch (error) {
    console.error('Connection check failed:', {
      error,
      message: error.message,
      stack: error.stack
    })
    let errorMessage = 'Connection failed'
    
    if (error.message.includes('401')) {
      errorMessage = 'Authentication failed. Please check your API token.'
    } else if (error.message.includes('CORS') || error.message.includes('access control')) {
      errorMessage = 'CORS error. Make sure CORS is enabled on the server.'
    } else if (error.message.includes('Load failed') || error.message.includes('Failed to fetch')) {
      errorMessage = 'Could not reach the server. Please check the URL and ensure the server is running.'
    }

    return {
      isConnected: false,
      models: [],
      error: `${errorMessage} (${error.message})`
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
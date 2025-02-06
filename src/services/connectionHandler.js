import { getModels } from './ollamaService'

export const checkOllamaConnection = async () => {
  try {
    const models = await getModels()
    return {
      isConnected: Array.isArray(models) && models.length > 0,
      models: models
    }
  } catch (error) {
    console.error('Connection check failed:', error)
    return {
      isConnected: false,
      models: []
    }
  }
}

export const loadModels = async () => {
  const { isConnected, models } = await checkOllamaConnection()
  return {
    isConnected,
    models: isConnected ? models : []
  }
}
import { PROMPTS } from '../config/prompts'

let baseUrl = 'http://localhost:11434'
let apiToken = null

export const setConnectionConfig = (url, token) => {
  baseUrl = url.trim()
  apiToken = token.trim()
}

const getApiPath = (endpoint) => {
  const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
  return `${baseUrl}${isLocalhost ? '/api/' : '/api/api/'}${endpoint}`
}

export const getModels = async () => {
  try {
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (!isLocalhost) {
      headers['bypass-tunnel-reminder'] = 'true'
    }

    if (apiToken) {
      headers['x-auth-token'] = apiToken
      console.log('Using API token:', apiToken.substring(0, 8) + '...')
    }

    const url = getApiPath('tags')
    console.log('Attempting to fetch models from:', url)
    console.log('Request headers:', headers)

    const response = await fetch(url, { 
      method: 'GET',
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (response.status === 0) {
      throw new Error(`CORS or Network Error - Please ensure:
        1. The server is running and accessible
        2. CORS is properly configured on the server
        3. The URL is correct: ${url}`)
    }
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.status === 401) {
      throw new Error('Authentication failed: Invalid or missing token')
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const rawText = await response.text()
    
    let data
    try {
      data = JSON.parse(rawText)
      console.log('Parsed response data:', data)
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Raw text:', rawText)
      throw new Error(`Invalid JSON response from server. Please check server configuration.`)
    }
    
    if (!data.models) {
      throw new Error(`Server response missing models array. Response: ${JSON.stringify(data)}`)
    }
    
    return data.models?.map(model => model.name) || []
  } catch (error) {
    const errorDetails = {
      error,
      message: error.message,
      type: error.type,
      url: getApiPath('tags'),
      token: apiToken ? 'Present' : 'Missing',
      status: error.status,
      name: error.name,
      isLocalhost: baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
    }
    console.error('Error fetching models:', errorDetails)
    
    if (error.message.includes('CORS')) {
      throw new Error(`CORS Error: The server at ${baseUrl} is not allowing requests from this origin.`)
    }
    throw error
  }
}

export const analyzeText = async (text, model) => {
  try {
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
    console.log('Sending request with:', { model, text })
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (!isLocalhost) {
      headers['bypass-tunnel-reminder'] = 'true'
    }

    if (apiToken) {
      headers['x-auth-token'] = apiToken
    }

    const response = await fetch(getApiPath('generate'), {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        model: model,
        system: PROMPTS.textAnalysis.system,
        prompt: PROMPTS.textAnalysis.prompt(text),
        stream: false
      }),
    })
    
    let data = await response.json()
    console.log('Received response:', data)

    data.response && (data.response = removeThinkTag(data.response)) // Filtering out the <think></think> tags to support COT models

    return data.response || 'No analysis available'
  } catch (error) {
    console.error('Error analyzing text:', error)
    return 'Error analyzing text'
  }
}

export const removeThinkTag = response => {
  const hasThinkTag = response.split('</think>').length > 1;
  if (hasThinkTag) return response.split('</think>').pop().trim()
  return response
}
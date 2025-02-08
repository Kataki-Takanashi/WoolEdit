import { PROMPTS } from '../config/prompts'

let baseUrl = 'http://localhost:11434'
let apiToken = null

export const setConnectionConfig = (url, token) => {
  console.log('setConnectionConfig called with:', { 
    url, 
    tokenPresent: !!token,
    currentBaseUrl: baseUrl 
  })
  baseUrl = url.trim().replace(/\/$/, '')
  apiToken = token.trim()
  console.log('Config updated:', { 
    newBaseUrl: baseUrl,
    tokenSet: !!apiToken 
  })
}

const getApiPath = (endpoint) => {
  // Always use the full URL from baseUrl
  const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
  const path = `${baseUrl}${isLocalhost ? '/api/' : '/api/api/'}${endpoint}`
  
  console.log('API Path Construction:', {
    baseUrl,
    isLocalhost,
    endpoint,
    constructedPath: path,
    windowLocation: typeof window !== 'undefined' ? window.location.href : 'undefined',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'undefined'
  })
  
  return path
}

export const getModels = async () => {
  try {
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
    console.log('Starting getModels function:', { baseUrl, isLocalhost })
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (!isLocalhost) {
      headers['ngrok-skip-browser-warning'] = 'true'
    }

    if (apiToken) {
      headers['x-auth-token'] = apiToken
      console.log('Using API token:', apiToken.substring(0, 8) + '...')
    }

    // Force API path construction logging
    console.log('About to construct API path...')
    const url = getApiPath('tags')
    
    console.log('Attempting to fetch models from:', url)
    console.log('Request headers:', headers)

    const response = await fetch(url, { 
      method: 'GET',
      headers,
      mode: 'cors',
      credentials: 'omit'
    }).catch(error => {
      console.error('Fetch error:', error)
      throw error
    })
    
    // Handle zero status (CORS or network error)
    if (response.status === 0) {
      throw new Error(`CORS or Network Error - Please ensure:
        1. The server is running and accessible
        2. CORS is properly configured on the server
        3. The URL is correct: ${url}`)
    }
    
    // Log raw response details
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
    
    // Try to parse the response text
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
    
    // Provide more specific error messages
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
      'Accept': 'application/json',
    }

    // Add ngrok header for non-localhost requests
    if (!isLocalhost) {
      headers['ngrok-skip-browser-warning'] = 'true'
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
    const data = await response.json()
    console.log('Received response:', data)
    return data.response || 'No analysis available'
  } catch (error) {
    console.error('Error analyzing text:', error)
    return 'Error analyzing text'
  }
}
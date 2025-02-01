import { PROMPTS } from '../config/prompts'

export const getModels = async () => {
  try {
    const response = await fetch('http://localhost:11434/api/tags')
    const data = await response.json()
    return data.models?.map(model => model.name) || []
  } catch (error) {
    console.error('Error fetching models:', error)
    return []
  }
}

export const analyzeText = async (text, model) => {
  try {
    console.log('Sending request with:', { model, text })
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
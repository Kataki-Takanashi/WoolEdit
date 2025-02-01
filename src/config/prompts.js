export const PROMPTS = {
  textAnalysis: {
    system: `You are a text correction tool. Your only task is to return the input text with corrected grammar and spelling. 
Do not provide any explanations or additional formatting. Output only the corrected text.`,
    prompt: (text) => `Fix any grammar and spelling errors in the following text. Return only the corrected text:

${text}`
  }
}
import { useState, useEffect, useRef } from 'react'
import { setConnectionConfig } from '../../services/ollamaService'
import { loadModels } from '../../services/connectionHandler'

const ModelSelector = ({ selectedModel, models, setSelectedModel, isOllamaConnected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 5
  const retryDelay = 2000

  const handleConnect = async () => {
    const connectionUrl = url.trim() || 'http://localhost:11434'
    
    const attemptConnection = async () => {
      try {
        setConnectionConfig(connectionUrl, apiToken)
        const { isConnected, error } = await loadModels()
        
        if (isConnected) {
          localStorage.setItem('ollamaUrl', connectionUrl)
          if (apiToken) {
            localStorage.setItem('ollamaToken', apiToken)
          }
          setIsModalOpen(false)
          window.location.reload()
          return true
        }
        return false
      } catch (error) {
        return false
      }
    }

    const retryConnection = async () => {
      if (await attemptConnection()) return

      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1)
        setTimeout(retryConnection, retryDelay)
      } else {
        alert('Failed to connect to Ollama after multiple attempts. Please check if Ollama is running.')
        setRetryCount(0)
      }
    }

    retryConnection()
  }

  const urlInputRef = useRef(null)

  useEffect(() => {
    if (isModalOpen && urlInputRef.current) {
      urlInputRef.current.focus()
    }
  }, [isModalOpen])

  const handleConnectionClick = () => {
    if (!isOllamaConnected) {
      setIsModalOpen(true)
    }
  }

  useEffect(() => {
    // Load saved connection details on component mount
    const savedUrl = localStorage.getItem('ollamaUrl')
    const savedToken = localStorage.getItem('ollamaToken')
    if (savedUrl) {
      setUrl(savedUrl)
      if (savedToken) {
        setApiToken(savedToken)
      }
      // Set the connection config with saved values
      setConnectionConfig(savedUrl, savedToken || '')
    }
  }, [])

  return (
    <div className={`relative ${isOllamaConnected ? 'group' : ''}`}>
      <button 
        className={`flex items-center justify-between px-3 py-1.5 text-sm rounded-md sm:w-40 md:w-60 border ${
          isOllamaConnected 
            ? 'hover:bg-gray-50 bg-white text-gray-600 border-gray-300' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
        }`}
        onClick={!isOllamaConnected ? handleConnectionClick : undefined}
      >
        <span className="truncate flex-1 text-center">
          {isOllamaConnected ? (selectedModel || 'Select Model') : 'Connect Ollama'}
        </span>
        {isOllamaConnected && (
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>

      {/* Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 w-[448px] shadow-xl transform transition-all animate-modalSlide">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Connect to Ollama Bridge</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  ref={urlInputRef}
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="http://localhost:11434"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
                <input
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="text-sm text-gray-600 mt-6 bg-gray-50 p-4 rounded-lg">
                You must use <a href="https://github.com/Kataki-Takanashi/ollama-bridge/releases/latest" className="text-blue-600 hover:text-blue-700 font-medium hover:underline" target="_blank" rel="noopener noreferrer">Ollama Bridge</a> to connect, be sure to read the <a href="https://github.com/Kataki-Takanashi/ollama-bridge?tab=readme-ov-file#quick-start" className="text-blue-600 hover:text-blue-700 font-medium hover:underline" target="_blank" rel="noopener noreferrer">Quick Start Guide</a>
              </p>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOllamaConnected && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0 w-64 
                      rounded-md shadow-sm bg-white border border-gray-200
                      opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100
                      transition-all duration-100 z-50">
          <div className="max-h-[400px] overflow-y-auto">
            {models.map((modelName) => (
              <button
                key={modelName}
                onClick={() => setSelectedModel(modelName)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                  selectedModel === modelName ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                {modelName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ModelSelector
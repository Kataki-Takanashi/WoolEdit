const ModelSelector = ({ selectedModel, models, setSelectedModel }) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md sm:w-40 md:w-60">
        <span className="truncate">{selectedModel || 'Select Model'}</span>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
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
    </div>
  )
}

export default ModelSelector
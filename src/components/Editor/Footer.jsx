import Toolbar from './Toolbar'
import ModelSelector from './ModelSelector'

const EditorFooter = ({ 
  editor, 
  selectedModel, 
  models, 
  setSelectedModel, 
  handleAnalyze, 
  isAnalyzing, 
  wordCount,
  isOllamaConnected,
  setIsModalOpen 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Toolbar editor={editor} />
            <div className="h-6 w-px bg-gray-200" />
            <ModelSelector
              selectedModel={selectedModel}
              models={models}
              setSelectedModel={setSelectedModel}
              isOllamaConnected={isOllamaConnected}
              setIsModalOpen={setIsModalOpen}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedModel || !isOllamaConnected}
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 
                min-w-[150px]
                bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 
                text-white rounded-md font-medium 
                shadow-[0_0_20px_rgba(79,70,229,0.3)] 
                hover:shadow-[0_0_25px_rgba(79,70,229,1)] 
                hover:scale-[1.02] 
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-300 ease-out"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze</span>
              )}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {wordCount} words
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorFooter
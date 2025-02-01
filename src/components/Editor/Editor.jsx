import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import React, { useState, useEffect } from 'react'
import Toolbar from './Toolbar'
import { getModels, analyzeText } from '../../services/ollamaService'

const Editor = () => {
  const [title, setTitle] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paste: {
          preserveFormat: true,
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Type or paste (⌘+V) your text here or upload a document.',
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none px-8 py-6 min-h-[calc(100vh-140px)] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const words = editor.storage.characterCount.words()
      setWordCount(words)
    },
  })

  useEffect(() => {
    const loadModels = async () => {
      const availableModels = await getModels()
      setModels(availableModels)
      if (availableModels.length > 0) {
        setSelectedModel(availableModels[0])
      }
    }
    loadModels()
  }, [])

  const handleAnalyze = async () => {
    if (!editor || !selectedModel) return
    
    setIsAnalyzing(true)
    const content = editor.getText()
    const result = await analyzeText(content, selectedModel)
    console.log('Analysis result:', result) // For testing purposes
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-white relative">
      <header className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          <input
            type="text"
            value={title}
            placeholder='Untitled document'
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold text-gray-900 w-full focus:outline-none border-none bg-transparent"
          />
        </div>
      </header>

      <main className="max-w-[900px] mx-auto pt-16">
        <div className="py-4">
          <div className="mt-4 pb-20">
            <EditorContent editor={editor} />
          </div>
        </div>
      </main>
            <div className="fixed bottom-0 left-0 right-0 bg-white">
              <div className="max-w-[900px] mx-auto px-6 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Toolbar editor={editor} />
                    <div className="h-6 w-px bg-gray-200" />
                    <div className="relative group">
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md sm:w-40 md:w-60"
                      >
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
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !selectedModel}
                      className="relative inline-flex items-center justify-center gap-2 px-4 py-2 
                        min-w-[150px]
                        bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 
                        text-white rounded-md font-medium 
                        shadow-[0_0_20px_rgba(79,70,229,0.3)] 
                        hover:shadow-[0_0_25px_rgba(79,70,229,0.45)] 
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
    </div>
  )
}

export default Editor
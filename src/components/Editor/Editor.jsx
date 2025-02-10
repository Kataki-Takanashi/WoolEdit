import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import React, { useState, useEffect } from 'react'
import { getModels, analyzeText } from '../../services/ollamaService'
import { analyzeTextDifferences, DiffHighlight } from '../../utils/textAnalysis'
import KeyboardShortcuts from './KeyboardShortcuts'
import Header from './Header'
import Footer from './Footer'
import { loadModels } from '../../services/connectionHandler'

const Editor = () => {
  const [title, setTitle] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isOllamaConnected, setIsOllamaConnected] = useState(false)
  
  // TipTap Config
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paste: {
          preserveFormat: true,
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Type or paste (⌘+V) your text here or drag and drop a document.', // TODO: add drag and drop to add text
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      // This is the diff highlight extension, it accepts the highlights onclick
      DiffHighlight.configure({
        HTMLAttributes: {
          onclick: (e) => {
            const correction = e.target.getAttribute('data-correction')
            const type = e.target.getAttribute('data-diff-type')
            
            if (type === 'deletion' && !correction) return
            
            const { from, to } = editor.state.selection
            editor.commands.setTextSelection({ from, to })
            
            if (type === 'deletion') {
              editor.commands.delete()
            } else {
              editor.commands.insertContent(correction)
            }
          }
        }
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none px-6 py-6 min-h-[calc(100vh-140px)] focus:outline-none',
      },
      handleDOMEvents: {
        click: (view, event) => {
          const target = event.target
          if (target.classList.contains('diff-highlight')) {
            const correction = target.getAttribute('data-correction')
            const type = target.getAttribute('data-diff-type')
            const pos = view.posAtDOM(target)
            const textLength = target.textContent.trim().length;
            
            // Makes the 1 char edits easier to see
            if (textLength === 1 && type === 'change') {
              target.classList.add('single-letter-edit');
            }
            
            // SHIFT + Click to REJECT
            if (event.shiftKey) {
              event.preventDefault()
              if (type === 'addition') {
                editor.chain()
                  .focus()
                  .setTextSelection({ from: pos, to: pos + textLength })
                  .unsetMark('diffHighlight')
                  .deleteSelection()
                  .run()
              } else {
                editor.chain()
                  .focus()
                  .setTextSelection({ from: pos, to: pos + textLength })
                  .unsetMark('diffHighlight')
                  .run()
              }
              return true
            }
            
            if (type === 'deletion') {
              editor.chain()
                .focus()
                .setTextSelection({ from: pos, to: pos + textLength })
                .unsetMark('diffHighlight')
                .deleteSelection()
                .run()
            } else if (correction) {
              editor.chain()
                .focus()
                .setTextSelection({ from: pos, to: pos + textLength })
                .unsetMark('diffHighlight')
                .insertContent(correction)
                .run()
            }
            return true
          }
          return false
        }
      }
    },
    // This is the word count extension, it updates the word count state (obviously)
    onUpdate: ({ editor }) => {
      const words = editor.storage.characterCount.words()
      setWordCount(words)
    },
    autofocus: true,
  })

  const handleAnalyze = async () => {
    if (!editor || !selectedModel || isAnalyzing) return
    
    setIsAnalyzing(true)
    try {
      const content = editor.getText()
      const correctedText = await analyzeText(content, selectedModel)
      
      if (correctedText) {
        const nodes = analyzeTextDifferences(content, correctedText)
        editor.commands.setContent(nodes)
      }
    } catch (error) {
      console.error('Error during analysis:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    const initializeConnection = async () => {
      const { isConnected, models: availableModels } = await loadModels()
      setIsOllamaConnected(isConnected)
      setModels(availableModels)
      if (isConnected && availableModels.length > 0) {
        setSelectedModel(availableModels[0])
      }
    }
    initializeConnection()
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      <KeyboardShortcuts editor={editor} handleAnalyze={handleAnalyze} />
      <Header title={title} setTitle={setTitle} />

      <main className="max-w-4xl mx-auto pt-16">
        <div className="py-4">
          <div className="mt-4 pb-20">
            <EditorContent editor={editor} />
          </div>
        </div>
      </main>

      <Footer
        editor={editor}
        selectedModel={selectedModel}
        models={models}
        setSelectedModel={setSelectedModel}
        handleAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        wordCount={wordCount}
        isOllamaConnected={isOllamaConnected}
      />
    </div>
  )
}

export default Editor
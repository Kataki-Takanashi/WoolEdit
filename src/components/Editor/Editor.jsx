import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import React, { useState } from 'react'
import Toolbar from './Toolbar'

const Editor = () => {
  const [title, setTitle] = useState('')
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
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
          <div className="mt-4 pb-20"> {/* Added pb-20 for bottom spacing */}
            <EditorContent editor={editor} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="max-w-[900px] mx-auto px-6 py-2 flex justify-between items-center">
          <Toolbar editor={editor} />
          <div className="text-sm text-gray-500">
            {wordCount} words
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
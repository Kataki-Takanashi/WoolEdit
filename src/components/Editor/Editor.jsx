import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import CharacterCount from '@tiptap/extension-character-count'
import React, { useState } from 'react'
import Toolbar from './Toolbar'

const Editor = () => {
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      TaskList,
      TaskItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[70vh] px-8 py-4 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      const words = editor.storage.characterCount.words()
      setWordCount(words)
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <Toolbar editor={editor} />
          <div className="relative">
            <EditorContent editor={editor} />
            <div className="absolute bottom-4 right-4 text-sm text-gray-500 dark:text-gray-400">
              {wordCount} words
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
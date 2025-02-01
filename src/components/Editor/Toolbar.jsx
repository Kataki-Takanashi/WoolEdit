import React from 'react'

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
        >
          <span className="font-bold text-lg">B</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
        >
          <span className="italic text-lg">I</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
        >
          <span className="underline text-lg">U</span>
        </button>
      </div>

      <div className="w-px h-5 bg-gray-200"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
        >
          H2
        </button>
      </div>

      <div className="w-px h-5 bg-gray-200"></div>

      <button className="p-2 rounded hover:bg-gray-100 text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
    </div>
  )
}

export default Toolbar
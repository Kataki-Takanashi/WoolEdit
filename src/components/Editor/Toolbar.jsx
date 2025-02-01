import React from 'react'

const ToolbarButton = ({ onClick, isActive, tooltip, children }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 text-gray-600 ${isActive ? 'bg-gray-100' : ''}`}
    >
      {children}
    </button>
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 min-w-max 
      rounded-md shadow-sm bg-white border border-gray-200 text-gray-600 text-xs
      opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100
      transition-all duration-100 pointer-events-none">
      {tooltip}
    </span>
  </div>
);

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          tooltip="Bold (⌘+B)"
        >
          <span className="font-bold text-lg">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          tooltip="Italic (⌘+I)"
        >
          <span className="italic text-lg">I</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          tooltip="Underline (⌘+U)"
        >
          <span className="underline text-lg">U</span>
        </ToolbarButton>
      </div>

      <div className="w-px h-5 bg-gray-200"></div>

      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          tooltip="Heading 1 (⌘+⌥+1)"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          tooltip="Heading 2 (⌘+⌥+2)"
        >
          H2
        </ToolbarButton>
      </div>

      <div className="w-px h-5 bg-gray-200"></div>

      <ToolbarButton
        onClick={() => {/* link handling */}}
        tooltip="Add link (⌘+K)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200"></div>

      <ToolbarButton
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        tooltip="Clear formatting (⌘+\)"
      >
        <span className="italic text-lg font-medium relative">
          T
          <span className="absolute inset-0 flex items-center justify-center">
            <div className="w-[1.2em] h-[1px] bg-current transform rotate-45 translate-y-[0.1em]"></div>
          </span>
        </span>
      </ToolbarButton>
    </div>
  );
};

export default Toolbar
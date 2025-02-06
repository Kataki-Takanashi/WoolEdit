/*
 * Keyboard Shortcuts:
 * ------------------
 * Cmd/Ctrl + Enter     - Analyze text
 * Cmd/Ctrl + Alt + A   - Accept all changes
 * Cmd/Ctrl + Alt + R   - Reject all changes
 * Alt + Right Arrow    - Accept next change
 * Alt + Left Arrow     - Reject next change
 * Cmd/Ctrl + Shift + A - Apply all edits
 * Cmd/Ctrl + ]         - Handle next mark
 */


import { useEffect } from 'react'

const KeyboardShortcuts = ({ editor, handleAnalyze }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + Enter to analyze
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        handleAnalyze()
      }

      // CMD/CTRL + SHIFT + A to apply all edits
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        e.stopPropagation()
        
        const highlights = Array.from(editor.view.dom.querySelectorAll('.diff-highlight'))
        editor.commands.unsetMark('diffHighlight')
        
        for (let i = highlights.length - 1; i >= 0; i--) {
          const element = highlights[i]
          const correction = element.getAttribute('data-correction')
          const type = element.getAttribute('data-diff-type')
          const pos = editor.view.posAtDOM(element, 0)
          const textLength = element.textContent.length
          
          if (type === 'deletion') {
            editor.commands.command(({ tr }) => {
              tr.delete(pos, pos + textLength)
              return true
            })
          } else if (correction) {
            editor.commands.command(({ tr }) => {
              tr.replaceWith(pos, pos + textLength, editor.state.schema.text(correction))
              return true
            })
          }
        }
        return
      }


      // Cmd/Ctrl + Alt + R to reject all changes
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        editor.commands.unsetMark('diffHighlight')
        return
      }

      // Alt + Right Arrow to accept next change
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        
        const highlights = Array.from(editor.view.dom.querySelectorAll('.diff-highlight'))
        
        if (highlights.length > 0) {
          const element = highlights[0]
          const correction = element.getAttribute('data-correction')
          const type = element.getAttribute('data-diff-type')
          const pos = editor.view.posAtDOM(element, 0)
          const textLength = element.textContent.length
          
          editor.chain()
            .focus()
            .setTextSelection({ from: pos, to: pos + textLength })
            .command(({ tr }) => {
              if (type === 'deletion') {
                tr.delete(pos, pos + textLength)
              } else if (correction) {
                tr.replaceWith(pos, pos + textLength, editor.state.schema.text(correction))
              }
              return true
            })
            .unsetMark('diffHighlight')
            .run()
        }
        return
      }

      // Alt + Left Arrow to reject next change
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        
        const highlights = Array.from(editor.view.dom.querySelectorAll('.diff-highlight'))
        
        if (highlights.length > 0) {
          const element = highlights[0]
          const type = element.getAttribute('data-diff-type')
          const pos = editor.view.posAtDOM(element, 0)
          const textLength = element.textContent.length
          
          editor.chain()
            .focus()
            .setTextSelection({ from: pos, to: pos + textLength })
            .command(({ tr }) => {
              if (type === 'addition') {
                tr.delete(pos, pos + textLength)
              }
              return true
            })
            .unsetMark('diffHighlight')
            .run()
        }
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, handleAnalyze])

  return null
}

export default KeyboardShortcuts
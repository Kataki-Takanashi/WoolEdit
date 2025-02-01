import DiffMatchPatch from 'diff-match-patch'
import { Mark, Extension } from '@tiptap/core'

export const CustomHighlight = Extension.create({
  name: 'customHighlight',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          class: {
            default: null,
            parseHTML: element => element.getAttribute('class'),
            renderHTML: attributes => {
              if (!attributes.class) return {}
              return { class: attributes.class }
            }
          }
        }
      }
    ]
  }
})

export const DiffHighlight = Mark.create({
  name: 'diffHighlight',
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'diff-highlight',
        onClick: (view, pos, event) => {
          const node = event.target
          const correction = node.getAttribute('data-correction')
          const type = node.getAttribute('data-diff-type')
          
          if (type === 'deletion') {
            view.dispatch(view.state.tr.delete(pos, pos + node.textContent.length))
          } else if (correction) {
            view.dispatch(view.state.tr.replaceWith(
              pos,
              pos + node.textContent.length,
              view.state.schema.text(correction)
            ))
          }
        }
      }
    }
  },
  addAttributes() {
    return {
      type: {
        default: null,
        parseHTML: element => element.getAttribute('data-diff-type'),
        renderHTML: attributes => {
          const type = attributes.type
          return {
            'data-diff-type': type,
            'data-correction': attributes.correction || '',
            class: `diff-highlight ${type}-highlight cursor-pointer relative group`,
            style: type === 'deletion' 
              ? 'background-color: #fecaca; text-decoration: line-through; color: #991b1b;'
              : type === 'addition'
              ? 'background-color: #bbf7d0; color: #000000;'
              : 'background-color: #dbeafe; color: #000000;'
          }
        }
      },
      correction: {
        default: null,
        parseHTML: element => element.getAttribute('data-correction'),
        renderHTML: attributes => attributes.correction ? { 'data-correction': attributes.correction } : {}
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-diff-type]',
        getAttrs: element => ({
          type: element.getAttribute('data-diff-type'),
        }),
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  }
})

export const analyzeTextDifferences = (content, correctedText) => {
  // Remove leading space from correctedText if original content doesn't start with space
  if (!content.startsWith(' ') && correctedText.startsWith(' ')) {
    correctedText = correctedText.trimStart()
  }
  
  const dmp = new DiffMatchPatch()
  const diffs = dmp.diff_main(content, correctedText)
  dmp.Diff_EditCost = 4
  dmp.diff_cleanupEfficiency(diffs)
  
  const nodes = [{
    type: 'paragraph',
    content: []
  }]
  
  for (let i = 0; i < diffs.length; i++) {
    const [operation, text] = diffs[i]
    const nextDiff = diffs[i + 1]
    
    if (operation === -1 && nextDiff && nextDiff[0] === 1) {
      const oldWord = text.trim()
      const newWord = nextDiff[1].trim()
      
      if (oldWord !== newWord && !shareCommonParts(oldWord, newWord)) {
        nodes[0].content.push({
          type: 'text',
          marks: [{ 
            type: 'diffHighlight', 
            attrs: { 
              type: 'change',
              correction: newWord 
            } 
          }],
          text: oldWord
        })
        i++
      } else {
        nodes[0].content.push({
          type: 'text',
          marks: [{ 
            type: 'diffHighlight', 
            attrs: { 
              type: 'deletion',
              correction: '' 
            } 
          }],
          text: text
        })
        nodes[0].content.push({
          type: 'text',
          marks: [{ 
            type: 'diffHighlight', 
            attrs: { 
              type: 'addition',
              correction: nextDiff[1] 
            } 
          }],
          text: nextDiff[1]
        })
        i++
      }
    } else if (operation === -1) {
      nodes[0].content.push({
        type: 'text',
        marks: [{ 
          type: 'diffHighlight', 
          attrs: { 
            type: 'deletion',
            correction: '' 
          } 
        }],
        text: text
      })
    } else if (operation === 1) {
      nodes[0].content.push({
        type: 'text',
        marks: [{ 
          type: 'diffHighlight', 
          attrs: { 
            type: 'addition',
            correction: text 
          } 
        }],
        text: text
      })
    } else {
      nodes[0].content.push({
        type: 'text',
        text: text
      })
    }
  }
  
  return nodes
}

const hasInternalChanges = (word1, word2) => {
  const commonStart = word1.slice(0, Math.min(word1.length, word2.length))
  return commonStart.length >= 3 && (word1.startsWith(commonStart) || word2.startsWith(commonStart))
}

const isRelatedWord = (word1, word2) => {
  if (word1.startsWith(word2) || word2.startsWith(word1)) {
    const longer = word1.length > word2.length ? word1 : word2
    const shorter = word1.length > word2.length ? word2 : word1
    const suffix = longer.slice(shorter.length)
    return /^(ing|ed|s|e|ly|er|est)$/.test(suffix)
  }
  return false
}

const shareCommonParts = (word1, word2) => {
  const minLength = Math.min(word1.length, word2.length)
  const commonStart = word1.slice(0, minLength)
  const commonEnd = word1.slice(-minLength)
  
  return word2.includes(commonStart) || word2.includes(commonEnd)
}

export const isMinorChange = (word1, word2) => {
  if (Math.abs(word1.length - word2.length) > 1) return false
  
  if (word1.startsWith(word2) || word2.startsWith(word1) ||
      word1.endsWith(word2) || word2.endsWith(word1)) {
    return true
  }
  
  let diffs = 0
  const maxLength = Math.max(word1.length, word2.length)
  for (let i = 0; i < maxLength; i++) {
    if (word1[i] !== word2[i]) diffs++
    if (diffs > 1) return false
  }
  return diffs === 1
}
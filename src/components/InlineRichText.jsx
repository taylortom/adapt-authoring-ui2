import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

const InlineRichText = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable document-style features
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false
      }),
      Link.configure({
        openOnClick: false
      }),
      Underline
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    }
  })

  return (
    <div className='inline-rich-text'>
      <div className='toolbar'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor?.isActive('underline') ? 'active' : ''}
        >
          Underline
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default InlineRichText

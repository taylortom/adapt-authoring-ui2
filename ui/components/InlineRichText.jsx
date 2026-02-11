import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { t } from '../utils/lang'

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
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
          className={editor?.isActive('bold') ? 'active' : ''}
        >
          {t('app.bold')}
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
          className={editor?.isActive('italic') ? 'active' : ''}
        >
          {t('app.italic')}
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          disabled={!editor}
          className={editor?.isActive('underline') ? 'active' : ''}
        >
          {t('app.underline')}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default InlineRichText

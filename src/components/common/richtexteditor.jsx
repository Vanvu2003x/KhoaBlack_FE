"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextStyle, { TextStyleKit } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import { FiBold, FiItalic, FiUnderline } from "react-icons/fi"

export default function RichTextEditor({ value = "", onChange }) {
    const [content, setContent] = useState(value)

    const editor = useEditor({
        extensions: [StarterKit, TextStyleKit, Color],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            setContent(html)
            onChange && onChange(html)
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] p-3 text-slate-200'
            }
        },
        immediatelyRender: false
    })

    if (!editor) return null

    return (
        <div className="bg-[#0F172A] border border-white/10 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-slate-900/50">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg transition-colors font-bold ${editor.isActive('bold') ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-lg transition-colors italic ${editor.isActive('italic') ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded-lg transition-colors line-through ${editor.isActive('strike') ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                    title="Strike"
                >
                    S
                </button>
                <div className="w-px h-6 bg-white/10 mx-2"></div>
                <input
                    type="color"
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                    title="Text Color"
                />
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="" />

            {/* Preview HTML (Optional - keep but styled) */}
            <div className="p-3 border-t border-white/10 bg-slate-900/30">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Preview (HTML):</label>
                <div
                    className="p-3 rounded-lg bg-[#020617] border border-white/5 text-slate-400 text-xs font-mono break-all max-h-32 overflow-y-auto custom-scrollbar"
                >
                    {content}
                </div>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextStyle, { TextStyleKit } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"

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
        immediatelyRender: false // tránh SSR mismatch
    })

    if (!editor) return null

    return (
        <div>
            {/* Toolbar */}
            <div className="mb-2 flex gap-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="font-bold border px-2 py-1 rounded hover:bg-gray-100"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="italic border px-2 py-1 rounded hover:bg-gray-100"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className="line-through border px-2 py-1 rounded hover:bg-gray-100"
                >
                    S
                </button>
                <input
                    type="color"
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    className="w-10 h-10 border rounded cursor-pointer"
                />
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="min-h-[150px] border p-2 rounded" />

            {/* Preview HTML */}
            <div className="mt-4">
                <label className="block font-medium mb-1">Preview:</label>
                <div
                    className="border p-2 min-h-[100px] rounded bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    )
}

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border p-2 rounded-md">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

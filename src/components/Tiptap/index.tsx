import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

import { Image as ImageIcon } from '@/icons';
import type { FC } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const Tiptap: FC<Props> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const addImage = () => {
    const url = window.prompt('Insira o endereço da imagem:');

    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div>
      <div className="flex bg-gray-100 rounded-t-md p-2">
        <button
          type="button"
          className={`bg-gray-100 p-1 rounded`}
          onClick={addImage}
        >
          <ImageIcon />
        </button>
      </div>
      <EditorContent className="border rounded-b-md p-3" editor={editor} />
    </div>
  );
};

export default Tiptap;

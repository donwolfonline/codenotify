import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useToast } from '~/components/ui/use-toast';
import { api } from '~/utils/api';
import type { Editor as Editor$1 } from '@tiptap/core';
import { useEffect } from 'react';

export default function NotePlayground({
  id,
  defaultValue,
}: {
  id?: string;
  defaultValue: string;
}) {
  const { toast } = useToast();
  const utils = api.useContext();

  const noteUpdate = api.note.update.useMutation({
    onSuccess(data) {
      if (!id) return;
      console.log(data);

      utils.note.getById.setData(
        { id },
        {
          data: {
            ...data.data,
            contentJson: data.data.contentJson,
            contentHTML: data.data.contentHTML,
          },
        },
      );
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `${error.data?.code} - ${error.message}`,
      });
    },
  });

  const updateNoteData = (editor: Editor$1 | undefined) => {
    if (!id || !editor) return;

    noteUpdate.mutate({
      params: {
        id: id,
      },
      body: {
        contentJson: JSON.stringify(editor.getJSON()),
        contentHTML: editor.getHTML(),
      },
    });
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  // Set content after editor is initialized
  useEffect(() => {
    if (editor && defaultValue) {
      try {
        const content = JSON.parse(defaultValue);
        editor.commands.setContent(content);
      } catch (e) {
        console.error('Failed to parse defaultValue:', e);
        editor.commands.setContent(defaultValue);
      }
    }
  }, [editor, defaultValue]);

  // Set up update handler after editor is initialized
  useEffect(() => {
    if (editor) {
      editor.on('update', ({ editor }) => {
        updateNoteData(editor);
      });
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="dark-theme relative">
      {noteUpdate.isLoading && (
        <div className="absolute right-2 top-2 z-10 rounded-sm bg-white px-3 py-1 text-xs text-black">
          Saving ...
        </div>
      )}
      <EditorContent 
        editor={editor} 
        className="relative min-h-[500px] w-full border-stone-200 bg-black sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg p-4"
      />
    </div>
  );
}

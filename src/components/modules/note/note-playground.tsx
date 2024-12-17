import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useToast } from '~/components/ui/use-toast';
import { api } from '~/utils/api';
import type { Editor as Editor$1, JSONContent } from '@tiptap/core';
import { useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

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
        (old) => {
          if (!old) return { data: data.data };
          return {
            ...old,
            data: {
              ...old.data,
              contentJson: data.data.contentJson,
              contentHTML: data.data.contentHTML,
            },
          };
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

  // Debounce the update function to prevent too frequent saves
  const debouncedUpdate = useCallback(
    debounce((editor: Editor$1) => {
      if (!id) return;

      noteUpdate.mutate({
        params: {
          id: id,
        },
        body: {
          contentJson: JSON.stringify(editor.getJSON()),
          contentHTML: editor.getHTML(),
        },
      });
    }, 1000),
    [id, noteUpdate]
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor);
    },
  });

  // Set content after editor is initialized
  useEffect(() => {
    if (editor && defaultValue && !editor.getText().trim()) {
      try {
        const content = JSON.parse(defaultValue) as JSONContent;
        editor.commands.setContent(content);
      } catch (e) {
        console.error('Failed to parse defaultValue:', e);
        editor.commands.setContent(defaultValue);
      }
    }
  }, [editor, defaultValue]);

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
        className="min-h-[500px] w-full rounded-md border p-5"
      />
    </div>
  );
}

import { useEditor, EditorContent, useEditorState, type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Unlink,
  RemoveFormatting,
  Image as ImageIcon,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  Eye,
  PencilLine,
  Undo2,
  Redo2,
  X,
} from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';

export interface EmailDocument {
  readonly html: string;
  readonly text: string;
}

interface TiptapEditorProps {
  readonly initialHtml?: string | undefined;
  readonly onChange: (doc: EmailDocument) => void;
  readonly ariaLabel?: string | undefined;
  /**
   * `framed` is the boxed editor used in dense panels. `document` strips the
   * chrome so the writing surface reads like a long-form article (Medium-style
   * composer), keeping only the quiet structural toolbar.
   */
  readonly variant?: 'framed' | 'document' | undefined;
}

function ToolbarButton({
  onPress,
  active,
  label,
  children,
}: {
  readonly onPress: () => void;
  readonly active?: boolean;
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={active ?? false}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-xs transition-colors ${
        active
          ? 'bg-brand-blue text-white'
          : 'text-white/70 hover:bg-ink-soft hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />;
}

/** Inline form panel for link / image entry. Enter submits, Escape closes. */
function Dialog({
  title,
  fields,
  submitLabel,
  error,
  onSubmit,
  onClose,
}: {
  readonly title: string;
  readonly fields: readonly {
    readonly label: string;
    readonly name: string;
    readonly placeholder: string;
  }[];
  readonly submitLabel: string;
  readonly error: string | null;
  readonly onSubmit: (values: FormData) => void;
  readonly onClose: () => void;
}) {
  return (
    <form
      onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const submit = (values: FormData): void => {
          onSubmit(values);
          if (form.querySelector('[aria-invalid="true"]') === null) {
            form.reset();
          }
        };
        submit(new FormData(form));
      }}
      className="flex flex-wrap items-end gap-2 border-b border-line bg-ink-raised px-3 py-2.5"
      aria-label={title}
    >
      {fields.map((field) => (
        <label
          key={field.name}
          className="flex flex-col gap-1 text-[11px] tracking-wide text-white/60 uppercase"
        >
          {field.label}
          <input
            name={field.name}
            type="text"
            placeholder={field.placeholder}
            aria-invalid={error !== null}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onClose();
            }}
            className="h-9 w-56 rounded-xs border border-line bg-ink px-2.5 text-sm text-paper transition-colors outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
          />
        </label>
      ))}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="submit"
          className="h-9 rounded-xs bg-brand-blue px-3 text-xs font-medium text-white transition-colors hover:bg-brand-blue-strong"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="flex h-9 w-9 items-center justify-center rounded-xs text-white/70 transition-colors hover:bg-ink-soft hover:text-white"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
      {error !== null && (
        <p role="alert" className="w-full text-xs text-[#ff9d91]">
          {error}
        </p>
      )}
    </form>
  );
}

/** Slate floating format bar, Medium-style: appears on text selection. */
function BubbleToolbar({
  editor,
  onLinkEdit,
}: {
  readonly editor: Editor;
  readonly onLinkEdit: () => void;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      bold: instance.isActive('bold'),
      italic: instance.isActive('italic'),
      underline: instance.isActive('underline'),
      strike: instance.isActive('strike'),
      h2: instance.isActive('heading', { level: 2 }),
      h3: instance.isActive('heading', { level: 3 }),
      link: instance.isActive('link'),
    }),
  });

  return (
    <div
      className="flex items-center gap-0.5 rounded-md border border-line bg-ink-raised p-1 shadow-xl shadow-black/50"
      role="toolbar"
      aria-label="Selection formatting"
    >
      <BubbleButton
        onPress={() => {
          editor.chain().focus().toggleBold().run();
        }}
        active={state.bold}
        label="Bold"
      >
        <Bold size={14} strokeWidth={2} />
      </BubbleButton>
      <BubbleButton
        onPress={() => {
          editor.chain().focus().toggleItalic().run();
        }}
        active={state.italic}
        label="Italic"
      >
        <Italic size={14} strokeWidth={2} />
      </BubbleButton>
      <BubbleButton
        onPress={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
        active={state.underline}
        label="Underline"
      >
        <UnderlineIcon size={14} strokeWidth={2} />
      </BubbleButton>
      <BubbleButton
        onPress={() => {
          editor.chain().focus().toggleStrike().run();
        }}
        active={state.strike}
        label="Strikethrough"
      >
        <Strikethrough size={14} strokeWidth={2} />
      </BubbleButton>
      <span className="mx-0.5 h-4 w-px bg-line" aria-hidden="true" />
      <BubbleButton
        onPress={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        active={state.h2}
        label="Heading 2"
      >
        <Heading2 size={14} strokeWidth={2} />
      </BubbleButton>
      <BubbleButton
        onPress={() => {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        active={state.h3}
        label="Heading 3"
      >
        <Heading3 size={14} strokeWidth={2} />
      </BubbleButton>
      <span className="mx-0.5 h-4 w-px bg-line" aria-hidden="true" />
      <BubbleButton
        onPress={() => {
          if (state.link) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
          } else {
            onLinkEdit();
          }
        }}
        active={state.link}
        label={state.link ? 'Remove link' : 'Add or edit link'}
      >
        {state.link ? (
          <Unlink size={14} strokeWidth={2} />
        ) : (
          <Link2 size={14} strokeWidth={2} />
        )}
      </BubbleButton>
      <BubbleButton
        onPress={() => {
          editor.chain().focus().unsetAllMarks().run();
        }}
        label="Clear formatting"
      >
        <RemoveFormatting size={14} strokeWidth={2} />
      </BubbleButton>
    </div>
  );
}

function BubbleButton({
  onPress,
  active,
  label,
  children,
}: {
  readonly onPress: () => void;
  readonly active?: boolean;
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={active ?? false}
      aria-label={label}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded-xs transition-colors ${
        active
          ? 'bg-brand-blue text-white'
          : 'text-white/70 hover:bg-ink-soft hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function EditorFooter({
  editor,
  previewing,
  onTogglePreview,
  document,
}: {
  readonly editor: Editor;
  readonly previewing: boolean;
  readonly onTogglePreview: () => void;
  readonly document?: boolean;
}) {
  const counting = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      words: instance.storage.characterCount.words(),
      characters: instance.storage.characterCount.characters(),
    }),
  });

  return (
    <div
      className={`flex items-center justify-between px-3 py-1.5 ${
        document ? 'border-t-0 bg-transparent px-0' : 'border-t border-line bg-ink-raised'
      }`}
    >
      <p className="text-xs text-muted tabular-nums" aria-live="polite">
        {String(counting.words)} words · {String(counting.characters)} characters
      </p>
      <button
        type="button"
        onClick={onTogglePreview}
        className={`flex h-7 items-center gap-1.5 rounded-xs px-2 text-xs transition-colors ${
          previewing
            ? 'bg-brand-blue text-white'
            : 'text-white/70 hover:bg-ink-soft hover:text-white'
        }`}
      >
        {previewing ? (
          <PencilLine size={13} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Eye size={13} strokeWidth={2} aria-hidden="true" />
        )}
        {previewing ? 'Back to editing' : 'How receivers see it'}
      </button>
    </div>
  );
}

const formValue = (data: FormData, name: string): string => {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
};

export function TiptapEditor({
  initialHtml,
  onChange,
  ariaLabel,
  variant = 'framed',
}: TiptapEditorProps) {
  const [dialog, setDialog] = useState<'none' | 'link' | 'image'>('none');
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const document = variant === 'document';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['paragraph', 'heading'] }),
      Placeholder.configure({
        placeholder: document
          ? 'Tell the story — what should readers take away?'
          : 'Write the email body — select text to format',
      }),
      CharacterCount.configure({ limit: 40_000 }),
    ],
    content: initialHtml ?? '<p></p>',
    editorProps: {
      attributes: {
        class: document ? 'tiptap-content tiptap-content-document' : 'tiptap-content',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': ariaLabel ?? 'Email body',
      },
    },
    // Emit on create and on every update so the parent always holds the
    // latest document without any effect wiring.
    onCreate: ({ editor: instance }) => {
      onChange({ html: instance.getHTML(), text: instance.getText() });
    },
    onUpdate: ({ editor: instance }) => {
      onChange({ html: instance.getHTML(), text: instance.getText() });
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div
        className={
          document
            ? 'h-64 animate-pulse bg-slate-100/70'
            : 'h-48 animate-pulse rounded-xs border border-line bg-ink'
        }
        aria-hidden="true"
      />
    );
  }

  const openDialog = (kind: 'link' | 'image'): void => {
    setDialogError(null);
    setDialog(kind);
  };

  const submitLink = (values: FormData): void => {
    const url = formValue(values, 'url').trim();
    setDialogError(null);
    if (!/^https?:\/\//i.test(url)) {
      setDialogError('Links must start with http:// or https://');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setDialog('none');
  };

  const submitImage = (values: FormData): void => {
    const src = formValue(values, 'src').trim();
    const alt = formValue(values, 'alt').trim();
    setDialogError(null);
    if (!/^https?:\/\//i.test(src)) {
      setDialogError('Image URLs must start with http:// or https://');
      return;
    }
    const altText = alt === '' ? undefined : alt;
    editor
      .chain()
      .focus()
      .setImage({ src, ...(altText === undefined ? {} : { alt: altText }) })
      .run();
    setDialog('none');
  };

  return (
    <div
      className={
        document
          ? 'bg-transparent'
          : 'overflow-hidden rounded-lg border border-line bg-ink shadow-sm'
      }
    >
      {dialog === 'link' && (
        <Dialog
          title="Link"
          fields={[
            {
              label: 'Link URL',
              name: 'url',
              placeholder: 'https://techignite.net',
            },
          ]}
          submitLabel="Apply link"
          error={dialogError}
          onSubmit={submitLink}
          onClose={() => {
            setDialog('none');
          }}
        />
      )}
      {dialog === 'image' && (
        <Dialog
          title="Insert image"
          fields={[
            {
              label: 'Image URL',
              name: 'src',
              placeholder: 'https://techignite.net/banner.png',
            },
            {
              label: 'Alt text',
              name: 'alt',
              placeholder: 'Hackathon banner',
            },
          ]}
          submitLabel="Insert image"
          error={dialogError}
          onSubmit={submitImage}
          onClose={() => {
            setDialog('none');
          }}
        />
      )}

      {/* Slim block-level actions — the full formatting kit floats on selection. */}
      <div
        className={`flex flex-wrap items-center gap-0.5 px-2 py-1.5 ${
          document
            ? 'border-b-0 bg-transparent px-0 pt-0 pb-3'
            : 'border-b border-line bg-ink-raised'
        }`}
        role="toolbar"
        aria-label="Insert and structure"
      >
        <ToolbarButton
          onPress={() => {
            openDialog('image');
          }}
          active={dialog === 'image'}
          label="Insert image"
        >
          <ImageIcon size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().toggleBlockquote().run();
          }}
          active={editor.isActive('blockquote')}
          label="Blockquote"
        >
          <Quote size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
          active={editor.isActive('bulletList')}
          label="Bullet list"
        >
          <List size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().toggleOrderedList().run();
          }}
          active={editor.isActive('orderedList')}
          label="Numbered list"
        >
          <ListOrdered size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().setHorizontalRule().run();
          }}
          label="Horizontal rule"
        >
          <Minus size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().setTextAlign('left').run();
          }}
          active={editor.isActive({ textAlign: 'left' })}
          label="Align left"
        >
          <AlignLeft size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().setTextAlign('center').run();
          }}
          active={editor.isActive({ textAlign: 'center' })}
          label="Align center"
        >
          <AlignCenter size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().undo().run();
          }}
          label="Undo"
        >
          <Undo2 size={15} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onPress={() => {
            editor.chain().focus().redo().run();
          }}
          label="Redo"
        >
          <Redo2 size={15} strokeWidth={2} />
        </ToolbarButton>
        {!document && (
          <span className="ml-auto text-xs text-muted">
            Select text for the format bar
          </span>
        )}
      </div>

      {previewing ? (
        <div
          className="tiptap-content pointer-events-none select-none"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      ) : (
        <>
          <BubbleMenu
            editor={editor}
            options={{
              placement: 'top',
              offset: 12,
            }}
            shouldShow={({ editor: instance }) =>
              !instance.state.selection.empty && !instance.isActive('image')
            }
          >
            <BubbleToolbar
              editor={editor}
              onLinkEdit={() => {
                openDialog('link');
              }}
            />
          </BubbleMenu>
          <EditorContent editor={editor} />
        </>
      )}

      <EditorFooter
        editor={editor}
        previewing={previewing}
        document={document}
        onTogglePreview={() => {
          setPreviewing(!previewing);
        }}
      />
    </div>
  );
}

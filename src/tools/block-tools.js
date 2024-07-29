export default function () {
  const basicBlocks = [
    {
      name: "paragraph",
      title: "Text",
      description: "Just good old plain text",
      icon: "<i class='fa-regular fa-text'></i>",
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
      convertCommand: (editor) => {
        editor.chain().focus().setParagraph().run();
      },
      canBeConverted: true,
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive("paragraph"),
    },
    {
      title: "Heading",
      name: "heading",
      description: "Headlines and subsections",
      icon: "<i class='fas fa-heading'></i>",
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
      },
      convertCommand: (editor) => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
      canBeConverted: true,
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive("heading"),
    },
    {
      title: "Table",
      name: "table",
      description: "Simple tables",
      icon: "<i class='fas fa-table'></i>",
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive("table"),
    },
    {
      title: "List",
      name: "list",
      description: "Simple lists (enumerated, itemized, etc.)",
      icon: "<i class='fas fa-list'></i>",
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive("bulletList") || editor.isActive("orderedList"),
    },
    {
      title: "Image",
      name: "image",
      description: "Simple image from URL or media library",
      icon: "<i class='fas fa-image'></i>",
      insertCommand: ({ editor, range }) => {
        const url = prompt('Enter image URL');
        if (url) {
          editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
        }
      },
      hasInlineTools: false,
      canBeConverted: false,
      isActiveTest: (editor) => editor.isActive('image'),
    },
    {
      title: "Code",
      name: "codeBlock",
      description: "Add a code section",
      icon: "<i class='fas fa-code'></i>",
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
      hasInlineTools: false,
      convertCommand: (editor) => {
        editor.chain().focus().toggleCodeBlock().run();
      },
      isActiveTest: (editor) => editor.isActive("codeBlock"),
    },
  ];

  const advancedBlocks = [
    {
      title: "Alert",
      name: "alert",
      description: "An alert block",
      icon: "<i class='fas fa-exclamation-circle'></i>",
      hasInlineTools: false,
      canBeConverted: false,
      isActiveTest: (editor) => editor.isActive("alert"),
    },
    {
      title: "Banner",
      name: "banner",
      description: "A banner with text and image",
      icon: "<i class='fas fa-images'></i>",
      hasInlineTools: false,
      canBeConverted: false,
      isActiveTest: (editor) => editor.isActive("banner"),
    },
    {
      title: "Cards",
      name: "cards",
      description: "A series of vertically arranged cards",
      icon: "<i class='fas fa-th-large'></i>",
      hasInlineTools: false,
      canBeConverted: false,
      isActiveTest: (editor) => editor.isActive("cards"),
    },
    {
      title: "Magic Block",
      name: "magicBlock",
      description: "Bring your own blocks with handlebars",
      icon: "<i class='fas fa-magic'></i>",
      hasInlineTools: false,
      canBeConverted: false,
      isActiveTest: (editor) => editor.isActive("magicBlock"),
    },
  ];
  return {
    basicBlocks,
    advancedBlocks,
  };
}

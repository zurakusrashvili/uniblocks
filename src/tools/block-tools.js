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
      title: "Card",
      name: "card",
      description: "A single card that can contain text or other elements within a cards container.",
      icon: "<i class='fas fa-square'></i>", // Example icon from FontAwesome for a card
      insertCommand: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).insertContent({
          type: 'card',
          content: [{
            type: 'innerBlock',  // Ensure this is the only type within 'card'
            content: [
              { type: 'titleBlock', content: [{ type: 'text', text: 'Professional Plan' }] },
              { type: 'pricingBlock', content: [{ type: 'text', text: '$49 / m' }] },
              {
                type: 'featuresBlock',
                content: [
                  { type: 'featureItem', content: [{ type: 'text', text: '20 team members' }] },
                  { type: 'featureItem', content: [{ type: 'text', text: 'Plan team meetings' }] },
                  { type: 'featureItem', content: [{ type: 'text', text: 'File sharing' }] }
                ]
              },
              { type: 'actionBlock', content: [{ type: 'text', text: 'Choose plan' }] }
            ]
          }]
        }).run();
      },
      hasInlineTools: true,
      isActiveTest: (editor) => editor.isActive('card'),
    },

    {
      title: "Cards Container",
      name: "cardsContainer",
      description: "A container that holds individual cards for grouped content display.",
      icon: "<i class='fas fa-layer-group'></i>", // Example icon from FontAwesome for a container
      insertCommand: ({ editor, range }) => {
        // Array to hold the content of three cards
        const cards = [
          {
            type: 'card',
            content: [{
              type: 'innerBlock',  // Ensure this is the only type within 'card'
              content: [
                { type: 'titleBlock', content: [{ type: 'text', text: 'Professional Plan' }] },
                { type: 'pricingBlock', content: [{ type: 'text', text: '$49 / m' }] },
                {
                  type: 'featuresBlock',
                  content: [
                    { type: 'featureItem', content: [{ type: 'text', text: '20 team members' }] },
                    { type: 'featureItem', content: [{ type: 'text', text: 'Plan team meetings' }] },
                    { type: 'featureItem', content: [{ type: 'text', text: 'File sharing' }] }
                  ]
                },
                { type: 'actionBlock', content: [{ type: 'text', text: 'Choose plan' }] }
              ]
            }]
          },
          {
            type: 'card',
            content: [{
              type: 'innerBlock',  // Ensure this is the only type within 'card'
              content: [
                { type: 'titleBlock', content: [{ type: 'text', text: 'Professional Plan' }] },
                { type: 'pricingBlock', content: [{ type: 'text', text: '$49 / m' }] },
                {
                  type: 'featuresBlock',
                  content: [
                    { type: 'featureItem', content: [{ type: 'text', text: '20 team members' }] },
                    { type: 'featureItem', content: [{ type: 'text', text: 'Plan team meetings' }] },
                    { type: 'featureItem', content: [{ type: 'text', text: 'File sharing' }] }
                  ]
                },
                { type: 'actionBlock', content: [{ type: 'text', text: 'Choose plan' }] }
              ]
            }]
          },
          {
            type: 'card',
            content: [{
              type: 'innerBlock',  // Ensure this is the only type within 'card'
              content: [
                { type: 'titleBlock', content: [{ type: 'text', text: 'Professional Plan' }] },
                { type: 'pricingBlock', content: [{ type: 'text', text: '$49 / m' }] },
                {
                  type: 'featuresBlock',
                  content: [
                    { type: 'featureItem', content: [{ type: 'text', text: '20 team members' }] },
                    { type: 'featureItem', content: [{ type: 'text', text: 'Plan team meetings' }] },
                    { type: 'featureItem', content: [{ type: 'text', text: 'File sharing' }] }
                  ]
                },
                { type: 'actionBlock', content: [{ type: 'text', text: 'Choose plan' }] }
              ]
            }]
          }
        ];

        // Create the container content with the cards
        const containerContent = {
          type: 'cardsContainer',
          content: cards
        };

        // Delete the current range and insert the container with the cards
        editor.chain().focus().deleteRange(range).insertContent(containerContent).run();
      },
      hasInlineTools: true, // Typically a container might not need inline tools
      isActiveTest: (editor) => editor.isActive('cardsContainer'),
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

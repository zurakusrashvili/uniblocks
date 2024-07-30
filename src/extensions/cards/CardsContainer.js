import { Node, mergeAttributes } from '@tiptap/core';

export const CardsContainer = Node.create({
  name: 'cardsContainer',

  group: 'block',

  content: 'card+',

  parseHTML() {
    return [
      { tag: 'div[data-type="cards-container"]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {'data-type': 'cards-container'}), 0];
  },
});
export const Card = Node.create({
    name: 'card',
  
    group: 'block',
  
    // This allows the card to contain block content, like paragraphs.
    content: 'block+',
  
    parseHTML() {
      return [
        { tag: 'div[data-type="card"]' },
      ];
    },
  
    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, {'data-type': 'card'}), 0];
    },
  });
  
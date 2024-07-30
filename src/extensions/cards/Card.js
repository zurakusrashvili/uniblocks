const Card = Node.create({
    name: 'card',
  
    content: 'text*',
    draggable: true,
  
    parseHTML() {
      return [
        {
          tag: 'div.card',
        },
      ];
    },
  
    renderHTML({ HTMLAttributes }) {
      return ['div', { class: 'card', style: 'padding: 10px; border: 1px solid black;' }, 0];
    }
  });
  
  export default Card;
  
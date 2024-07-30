import { Node, mergeAttributes } from '@tiptap/core';

export const CardsContainer = Node.create({
  name: 'cardsContainer',
  group: 'block',
  content: 'card+',
  parseHTML() {
    return [{ tag: 'div.cards-container' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cards-container' }), 0];
  }
});

export const Card = Node.create({
  name: 'card',
  group: 'block',
  content: 'innerBlock',
  parseHTML() {
      return [{ tag: 'div.plan' }];
  },
  renderHTML() {
      return ['div', { class: 'plan' }, 0];
  }
});

export const InnerBlock = Node.create({
  name: 'innerBlock',
  content: 'titleBlock pricingBlock featuresBlock actionBlock',  // Ensure this is correctly set
  parseHTML() {
      return [{ tag: 'div.inner' }];
  },
  renderHTML() {
      return ['div', { class: 'inner' }, 0];
  }
});

export const PricingBlock = Node.create({
  name: 'pricingBlock',
  content: 'text*',
  parseHTML() {
      return [{ tag: 'span.pricing' }];
  },
  renderHTML() {
      return ['span', { class: 'pricing' }, 0];
  }
});
export const TitleBlock = Node.create({
  name: 'titleBlock',
  content: 'text*',  // Ensure this accepts only text
  parseHTML() {
      return [{ tag: 'p.title' }];
  },
  renderHTML({ node }) {
      return ['p', { class: 'title' }, 0];  // Make sure no unwanted nesting
  }
});

export const InfoBlock = Node.create({
  name: 'infoBlock',
  content: 'text*',
  parseHTML() {
      return [{ tag: 'p.info' }];
  },
  renderHTML() {
      return ['p', { class: 'info' }, 0];
  }
});

export const FeaturesBlock = Node.create({
  name: 'featuresBlock',
  content: 'featureItem+',
  parseHTML() {
      return [{ tag: 'ul.features' }];
  },
  renderHTML() {
      return ['ul', { class: 'features' }, 0];
  }
});

export const FeatureItem = Node.create({
  name: 'featureItem',
  content: 'text*',
  parseHTML() {
      return [{ tag: 'li' }];
  },
  renderHTML() {
      return ['li', 0];
  }
});

export const ActionBlock = Node.create({
  name: 'actionBlock',
  content: 'text*',
  parseHTML() {
      return [{ tag: 'div.action' }];
  },
  renderHTML() {
      return ['div', { class: 'action' }, 0];
  }
});

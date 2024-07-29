import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";

import CommandsList from "./CommandsList.vue";

export default function (basicBlocks, advancedBlocks) {
  return {
    items: ({ query }) => {
      const filteredBasicBlocks = basicBlocks.filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      );
      const filteredAdvancedBlocks = advancedBlocks.filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      );
      return { basicBlocks: filteredBasicBlocks, advancedBlocks: filteredAdvancedBlocks };
    },

    render: () => {
      let component;
      let popup;

      return {
        onStart: (props) => {
          component = new VueRenderer(CommandsList, {
            props: {
              ...props,
              basicBlocks: props.items.basicBlocks,
              advancedBlocks: props.items.advancedBlocks,
            },
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => component.editor.view.dom.parentNode.parentNode,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },

        onUpdate(props) {
          component.updateProps({
            ...props,
            basicBlocks: props.items.basicBlocks,
            advancedBlocks: props.items.advancedBlocks,
          });

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            popup[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
}

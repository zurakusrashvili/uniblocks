<template>
  <div class="uniblocks">
    <bubble-menu v-if="editor && tableRowTools" :editor="editor" pluginKey="tableRowMenu" :should-show="tableIsActive"
      :tippy-options="getBubbleMenuOptions">
      <menu-item>
        <menu-button title="Row tools" class="rounded-full text-slate-400 hover:text-slate-800"
          :content="moreIconRound" />

        <template #dropdown>
          <menu-dropdown-button v-for="tool in tableRowTools" v-html="tool.icon + ' ' + tool.title" :key="tool.title"
            :label="tool.title" @click.prevent="tool.command(editor)" />
        </template>
      </menu-item>
    </bubble-menu>

    <bubble-menu v-if="editor && tableColumnTools" :editor="editor" pluginKey="tableColumnMenu"
      :should-show="tableIsActive" :tippy-options="getBubbleMenuOptions">
      <menu-item>
        <menu-button title="Column tools" :content="moreIconRound"
          class="rounded-full text-slate-400 hover:text-slate-800" />
        <template #dropdown>
          <menu-dropdown-button v-for="tool in tableColumnTools" :content="tool.icon + ' ' + tool.title"
            :key="tool.title" :label="tool.title" @click.prevent="tool.command(editor)" />
        </template>
      </menu-item>
    </bubble-menu>

    <bubble-menu pluginKey="mainMenu" @dragend="endDragging($event)" :draggable="dragging"
      :should-show="shouldShowMainToolbar" v-if="editor"
      class="text-sm bg-white max-w-screen flex divide-x max-w-full divide-slate-400 flex-row border-slate-400 md:rounded border-t md:border"
      :editor="editor" :class="{
      'mouse:pointer-events-none mouse:opacity-0': isTyping,
    }" :tippy-options="getBubbleMenuOptions">
      <div class="flex flex-row">
        <button @click.prevent @mousedown="startDragging($event)" @mouseup="
      draggedNodePosition = false;
    dragging = false;
    " class="hidden md:block ml-1 my-2 hover:bg-slate-100 rounded" :class="{
      'cursor-grab': !dragging,
      'cursor-grabbing mr-1': dragging,
    }" aria-label="Drag" data-tooltip="Drag">
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"
            focusable="false" class="w-5 h-5 md:w-6 md:h-6">
            <path d="M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"></path>
          </svg>
        </button>

        <div class="py-1 md:py-2 group relative" v-if="!dragging && currentBlockTool">
          <menu-item>
            <menu-button @click.prevent :title="currentBlockTool?.name" :content="currentBlockTool?.icon" :class="currentBlockTool?.canBeConverted &&
      'group-focus-within:bg-slate-600 !cursor-pointer group-focus-within:text-white hover:bg-slate-50'
      " />
            <template v-if="currentBlockTool?.canBeConverted" #dropdown>
              <div class="p-3 uppercase text-gray-600 text-xs pb-1 tracking-wide">
                Transform to
              </div>
              <menu-dropdown-button v-for="tool in allBlockTools.filter(
      (tool) => tool.convertCommand
    )" :content="tool.icon + ' ' + tool.title" :key="tool.title" :label="tool.title"
                @click.prevent="tool.convertCommand(editor)" activeClass="hidden" :active="tool.isActiveTest(editor)" />
            </template>
          </menu-item>
        </div>

        <div class="pr-2 flex flex-col" v-if="!dragging">
          <button @click.prevent="moveNode('UP')" :disabled="!canMoveNodeUp()" data-tooltip="Move up"
            class="mt-1 md:mt-2">
            <svg width="24" height="24" class="pointer-events-none w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z"></path>
            </svg>
          </button>
          <button @click.prevent="moveNode('DOWN')" :disabled="!canMoveNodeDown()" data-tooltip="Move down"
            class="-mt-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true"
              viewBox="0 0 24 24" class="pointer-events-none -mt-2 w-5 h-5 md:w-6 md:h-6">
              <path d="M17.5 11.6 12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex gap-1 items-center hide-empty flex-row p-1 md:p-2" v-if="!dragging">
        <menu-item v-for="(alignmentToolGroup, key) in activeAlignmentTools" :key="key">
          <menu-button @click.prevent :title="alignmentToolGroup.find((tool) =>
      tool.isActiveTest(editor, topLevelNodeType)
    )?.title
      " :content="alignmentToolGroup.find((tool) =>
      tool.isActiveTest(editor, topLevelNodeType)
    )?.icon
      " />

          <template #dropdown>
            <menu-dropdown-button v-for="tool in alignmentToolGroup" :key="tool.title"
              :content="tool.icon + ' ' + tool.title" :label="tool.title" @click.prevent="tool.command(editor)"
              :active="tool.isActiveTest(editor, topLevelNodeType)" />
          </template>
        </menu-item>
      </div>

      <div v-if="!dragging && currentBlockTool?.tools?.length" class="gap-1 flex flex-row items-center p-1 md:p-2">
        <menu-button v-for="tool in currentBlockTool?.tools" :key="tool.name" :content="tool.icon" :label="tool.title"
          :activeClass="tool.isActiveClass" @click.prevent="tool.command.call(0, editor)"
          :disabled="tool.isDisabledTest?.call(0, editor)" :active="tool.isActiveTest?.call(0, editor)"></menu-button>
      </div>

      <div v-if="currentBlockTool?.hasInlineTools && !dragging"
        class="p-1 gap-0.5 md:p-2 md:gap-1 flex relative flex-row items-center">
        <menu-item align="right" :key="tool.title" v-for="tool in allInlineTools">
          <menu-button :content="tool.icon" :label="tool.title" :activeClass="tool.isActiveClass"
            @click.prevent="tool.command(editor)" :active="tool.isActiveTest(editor)"></menu-button>
          <template #dropdown>
            <menu-dropdown-button v-for="tool in tool.tools" :key="tool.name" :content="tool.icon + ' ' + tool.title"
              @click.prevent="tool.command(editor)" :active="tool.isActiveTest(editor)" />
          </template>
        </menu-item>
      </div>

      <div v-if="editor && editor.can().deleteNode(topLevelNodeType) && !dragging"
        class="p-1 gap-0.5 md:p-2 md:gap-1 flex group flex-row items-center relative">
        <menu-item align="right">
          <menu-button @click.prevent :content="moreIcon" label="More options"></menu-button>
          <template #dropdown>
            <menu-dropdown-button ref="deleteButton" :content="deleteIcon + ' Delete'" label="Delete block"
              @click.prevent="deleteNode(topLevelNodeType)" />
          </template>
        </menu-item>
      </div>
    </bubble-menu>

    <BlockSidebar :blocks="blocks" :editor="editor" @select-block="selectBlock" />

    <editor-content :class="editorClass ?? 'prose'" @keydown="isTyping = true" @keyup.esc="isTyping = false"
      ref="editor" :editor="editor" />
  </div>

  <button class="log-icon" @click="logEditorValue">
    <i class="fas fa-download"></i>
  </button>
</template>

<script>
import MenuButton from "@/components/MenuButton.vue";
import MenuItem from "@/components/MenuItem.vue";
import MenuDropdownButton from "@/components/MenuDropdownButton.vue";
import BlockSidebar from "@/components/BlockSidebar.vue";

import { BubbleMenu, Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { Image } from '@tiptap/extension-image';

import {
  DragNode,
  MoveNode,
  GetTopLevelBlockCoords,
  GetTableColumnCoords,
  GetTableRowCoords,
  GetTopLevelNode,
} from "../utils/pm-utils.js";

import { mergeArrays } from "../utils/utils";

import BlockWidth from "../extensions/block-width";
import { Youtube } from "../extensions/youtube";
import { TrailingNode } from "../extensions/trailing-node";
import { InsertBetween } from "../extensions/insert-between";
import Variants from "../extensions/variants";

import Commands from "./commands";
import suggestion from "./suggestion";

import defaultBlockTools from "../tools/block-tools";
import defaultInlineTools from "../tools/inline-tools";
import defaultAlignmentTools from "../tools/alignment-tools";
import { tableRowTools, tableColumnTools } from "../tools/table-tools";
import {
  Card,
  InnerBlock,
  PricingBlock,
  TitleBlock,
  InfoBlock,
  FeaturesBlock,
  FeatureItem,
  ActionBlock, CardsContainer
} from '../extensions/cards/CardsContainer'



export default {
  components: {
    BubbleMenu,
    EditorContent,
    MenuButton,
    MenuItem,
    MenuDropdownButton,
    BlockSidebar
  },

  props: {
    modelValue: {},
    editable: {
      default: true,
    },
    placeholder: {
      type: String,
      default: "Type / to choose a block",
    },
    editorClass: {
      type: String,
    },
    mode: {
      type: String,
      default: "html",
    },
    extensions: {
      type: Array,
      default: () => [],
    },
    blockTools: {
      type: Array,
      default: () => [],
    },
    inlineTools: {
      type: Array,
      default: () => [],
    },
    alignmentTools: {
      type: Array,
      default: () => [],
    },
    variantsTypes: {
      type: Array,
      default: () => [
        "paragraph",
        "heading",
        "horizontalRule",
        "blockquote",
        "list",
        "youtube",
      ],
    },
  },

  data() {
    const { basicBlocks, advancedBlocks } = defaultBlockTools();
    const mergedBasicBlocks = mergeArrays(basicBlocks, this.blockTools.filter(tool => basicBlocks.find(block => block.name === tool.name)));
    const mergedAdvancedBlocks = mergeArrays(advancedBlocks, this.blockTools.filter(tool => advancedBlocks.find(block => block.name === tool.name)));

    return {
      basicBlocks,
      advancedBlocks,
      dragging: false,
      draggedNodePosition: null,
      editor: null,
      blocks: [],  // Initialize blocks data
      activeBlock: null,  // Active block for displaying the bubble menu
      allBlockTools: [...mergedBasicBlocks, ...mergedAdvancedBlocks],
      allInlineTools: mergeArrays(defaultInlineTools(), this.inlineTools),
      allAlignmentTools: this.alignmentTools.length
        ? this.alignmentTools
        : defaultAlignmentTools(),
      tableRowTools: tableRowTools(),
      tableColumnTools: tableColumnTools(),
      topLevelNodeType: null,
      currentBlockTool: null,
      isTyping: false,
      showMainToolbar: false,
      moreIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/></svg>',
      deleteIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>',
      moreIconRound:
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
  },

  created: function () {
    window.addEventListener("mousemove", () => this.cancelTyping());
  },

  unmounted: function () {
    window.removeEventListener("mousemove", () => this.cancelTyping());
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit.configure({
          blockquote: false,
        }),
        Blockquote.extend({
          content: "paragraph",
        }),
        TrailingNode,
        InsertBetween,
        Subscript,
        Superscript,
        Highlight,
        Commands.configure({
          suggestion: suggestion(this.basicBlocks, this.advancedBlocks),
        }),
        Link.configure({
          openOnClick: false,
        }),
        Placeholder.configure({
          placeholder: this.placeholder,
        }),
        BlockWidth.configure({
          // types: this.blockWidthTypes,
        }),
        Variants.configure({
          types: this.variantsTypes,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow.extend({
          allowGapCursor: false,
        }),
        TableHeader.extend({
          content: "(inline|hardBreak?)*",
          isolating: false,
        }),
        TableCell.extend({
          content: "(inline|hardBreak?)*",
          isolating: false,
        }),
        Youtube.configure({
          inline: false,
          HTMLAttributes: {
            class: "aspect-video h-auto w-full",
          },
        }),
        Image,
        CardsContainer,
        InnerBlock,
        PricingBlock,
        TitleBlock,
        InfoBlock,
        FeaturesBlock,
        FeatureItem,
        ActionBlock,
        Card,
        ...this.extensions,
      ],

      onUpdate: () => {
        this.updateToolbar();
        this.$emit(
          "update:modelValue",
          this.mode == "json"
            ? this.editor.getJSON().content
            : this.editor.getHTML()
        );
        this.updateBlocks();  // Call the method to update blocks
      },

      onSelectionUpdate: () => {
        this.updateToolbar();
        // this.nodeTree = GetNodeTree(this.editor.view);
      },
    });

    this.editor.commands.setContent(
      this.mode == "json"
        ? {
          type: "doc",
          content: this.modelValue,
        }
        : this.modelValue
    );

    this.editor.setEditable(this.editable);

  },

  beforeUnmount() {
    this.editor.destroy();
  },

  watch: {
    topLevelNodeType() {
      this.currentBlockTool = this.getCurrentBlockTool();
    },
    editable() {
      this.editor.setEditable(this.editable);
    },
    modelValue() {
      this.$nextTick(() => {
        this.updateBlocks();
      });
    },
  },

  computed: {
    activeAlignmentTools() {
      if (this.topLevelNodeType) {
        return this.allAlignmentTools.filter((alignmentToolGroup) =>
          alignmentToolGroup.find((tool) =>
            tool.isActiveTest(this.editor, this.topLevelNodeType)
          )
        );
      } else {
        return null;
      }
    },
  },

  methods: {
    cancelTyping() {
      this.$nextTick(() => (this.isTyping = false));
    },
    logEditorValue() {
      const content = this.editor.getJSON();

      const beautifiedJson = JSON.stringify(content, null, 2); 

      const blob = new Blob([beautifiedJson], { type: 'application/json' });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'editor-content.json'; 
      document.body.appendChild(a); 
      a.click();
      document.body.removeChild(a); 

 
      console.log(beautifiedJson);
    },


    shouldShowMainToolbar() {
      return this.editable && this.editor.isActive() && this.modelValue;
    },

    updateToolbar() {
      this.topLevelNodeType = this.getTopLevelNodeType();
    },

    getCurrentBlockTool() {
      return this.allBlockTools.find(
        (tool) =>
          tool.name == this.topLevelNodeType ||
          tool.tools?.find((tool) => tool.name == this.topLevelNodeType)
      );
    },

    deleteNode(node) {
      this.editor.commands.deleteNode(node);
      this.$refs.deleteButton.$el.blur();
    },

    getMenuCoords() {
      return GetTopLevelBlockCoords(this.editor.view);
    },

    getTableRowMenuCoords() {
      return GetTableRowCoords(this.editor.view);
    },

    getTableColumnMenuCoords() {
      return GetTableColumnCoords(this.editor.view);
    },

    startDragging(event) {
      let coords = { left: event.clientX, top: event.clientY + 48 };
      this.draggedNodePosition = this.editor.view.posAtCoords(coords).pos;
      this.dragging = true;
    },

    endDragging(event) {
      let targetNodeFromCoords = this.editor.view.posAtCoords({
        left: event.clientX,
        top: event.clientY + 20,
      });

      if (targetNodeFromCoords) {
        DragNode({
          view: this.editor.view,
          state: this.editor.state,
          draggedNodePosition: this.draggedNodePosition,
          targetNodePosition: targetNodeFromCoords.pos,
        });
      }

      this.dragging = false;
      this.draggedNode = null;
    },

    tableIsActive() {
      return this.editable && this.getTopLevelNodeType() == "table";
    },

    moveNode(dir = "UP") {
      MoveNode({
        view: this.editor.view,
        dir: dir,
        currentResolved: this.editor.view.state.selection.$from,
      });
    },

    getTopLevelNodeType() {
      return GetTopLevelNode(this.editor.view)?.type.name;
    },

    canMoveNodeDown() {
      const selectionStart = this.editor.view.state.selection.$from;
      return selectionStart.index(0) < selectionStart.node(0).childCount - 1;
    },

    canMoveNodeUp() {
      const selectionStart = this.editor.view.state.selection.$from;
      return selectionStart.index(0) > 0;
    },
    updateBlocks() {
      const blocks = [];
      const doc = this.editor.state.doc;

      // Create a mapping of block names to their definitions
      const blockDefinitions = [...this.basicBlocks, ...this.advancedBlocks].reduce((acc, block) => {
        acc[block.name] = block;
        return acc;
      }, {});

      doc.descendants((node, pos) => {
        // Only include top-level blocks
        if (this.editor.view.state.doc.resolve(pos).depth === 0) {
          const coords = this.editor.view.coordsAtPos(pos);
          const blockDef = blockDefinitions[node.type.name];
          if (blockDef) {
            blocks.push({
              type: node.type.name,
              position: pos,
              top: coords.top,
              left: coords.left,
              icon: blockDef.icon,
            });
          }
        }
      });

      this.blocks = blocks;

    },

    selectBlock(block) {
      this.activeBlock = block;
      this.editor.commands.setTextSelection({ from: block.position, to: block.position });
      this.editor.view.focus();
    },

    performAction(action, block) {
      if (action === 'edit') {
        this.selectBlock(block);
      } else if (action === 'delete') {
        this.editor.commands.deleteNode(block.position);
      }
      this.activeMenuIndex = null;
    },

    getBubbleMenuOptions() {
      if (this.activeBlock) {
        return {
          placement: 'right',
          getReferenceClientRect: () => {
            const element = document.querySelector(`[data-block-id="${this.activeBlock.position}"]`);
            return element.getBoundingClientRect();
          },
        };
      }
      return {};
    },
  },
};
</script>

<style>
@import "@/style.css";
</style>

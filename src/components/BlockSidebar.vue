<template>
  <div class="sidebar">
    <ul>
      <li v-for="(block, index) in blocks" :key="block.position" :style="{ top: `${block.top}px`, left: '5px', position: 'absolute' }" @click="selectBlock(block)">
        <i v-html="block.icon"></i>
        <span class="block-name">{{block.type}}</span>
      </li>
    </ul>
    <div class="add-block" @click="toggleAddMenu">
      <i class="fa-regular fa-plus"></i>
      <AddBlockMenu ref="addBlockMenu" :visible="addMenuVisible" :basic-blocks="basicBlocks" :advanced-blocks="advancedBlocks" @add-block="addBlock" />
    </div>
  </div>
</template>






<script>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import AddBlockMenu from './AddBlockMenu.vue'

export default {
  name: 'SidebarComponent',
  components: {
    NodeViewWrapper,
    NodeViewContent,
    AddBlockMenu,
  },
  props: {
    blocks: {
      type: Array,
      required: true,
    },
    editor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      addMenuVisible: false,
      basicBlocks: [
        // Your basic blocks here
      ],
      advancedBlocks: [
        // Your advanced blocks here
      ],
    }
  },
  mounted() {
    // this.updateBlocks()
    // this.editor.on('transaction', this.updateBlocks)
  },
  beforeUnmount() {
    // this.editor.off('transaction', this.updateBlocks)
  },
  methods: {
    updateBlocks() {
      const blocks = this.editor.state.doc.content.content.map((block, index) => ({
        id: index,
        type: block.type.name,
        content: block.content,
      }))
      this.blocks = blocks
    },
    selectBlock(block) {
      this.editor.commands.setTextSelection({ from: block.position, to: block.position });
      this.editor.view.focus();
    },
    toggleAddMenu() {
      this.addMenuVisible = !this.addMenuVisible
    },
    addBlock(block) {
      this.editor.commands.insertContent(block)
      this.addMenuVisible = false
    },
    getIcon(block) {
      // Logic to return the appropriate icon for the block
      // You need to define how you want to map block types to icons
    },
    getBlockName(block) {
      // Logic to return the appropriate name for the block
      // You need to define how you want to map block types to names
    },

    
  },
}
</script>

<style scoped>
.sidebar {
  width: 50px;
  height:2400px;
  background-color: #f4f4f4;
  padding: 2;
  border-right: 1px solid #ddd;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 999;
  top:0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.sidebar li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  position: relative;
}

.sidebar li i {
  margin-right: 10px;
  font-size: 18px;
}

.sidebar li:hover {
  background-color: #eaeaea;
}

.block-name {
  visibility: hidden;
  position: absolute;
  left: 40px;
  background-color: #fff;
  padding: 2px 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.sidebar li:hover .block-name {
  visibility: visible;
}

.add-block {
  cursor: pointer;
  padding: 10px;
  background-color: #ddd;
  text-align: center;
  margin-top: 20px;
  position: fixed;
  bottom: 25px;
  left: 5px;
}

.add-block:hover {
  background-color: #ccc;
}
</style>

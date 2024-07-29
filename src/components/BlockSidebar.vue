<template>
  <div class="sidebar">
    <ul>
      <li v-for="block in addedBlocks" :key="block.name" @mouseover="showBlockName(block)" @mouseleave="hideBlockName" @click="selectBlock(block)">
        <i :class="block.icon"></i>
        <span class="block-name">{{ block.displayName }}</span>
      </li>
    </ul>
    <div class="add-block" @click="toggleAddMenu">
      <i class="fa-regular fa-plus"></i>
      <AddBlockMenu ref="addBlockMenu" :visible="addMenuVisible" :basic-blocks="basicBlocks" :advanced-blocks="advancedBlocks" @add-block="addBlock" />
    </div>
  </div>
</template>

<script>
import AddBlockMenu from './AddBlockMenu.vue';

export default {
  name: 'BlockSidebar',
  components: {
    AddBlockMenu,
  },
  props: {
    addedBlocks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      basicBlocks: [
        { name: 'text', icon: 'fa-solid fa-paragraph', displayName: 'Text', description: 'Just good old plain text' },
        { name: 'headline', icon: 'fa-regular fa-heading', displayName: 'Headline', description: 'Headlines and subsections' },
        { name: 'table', icon: 'fa-regular fa-table', displayName: 'Table', description: 'Simple tables' },
        { name: 'list', icon: 'fa-regular fa-list', displayName: 'List', description: 'Simple lists (enumerated, itemized, etc.)' },
        { name: 'image', icon: 'fa-regular fa-image', displayName: 'Image', description: 'Simple image from URL or media library' },
        { name: 'code', icon: 'fa-regular fa-code', displayName: 'Code', description: 'Add a code section' },
      ],
      advancedBlocks: [
        { name: 'alert', icon: 'fa-regular fa-exclamation-triangle', displayName: 'Alert', description: 'An alert block' },
        { name: 'banner', icon: 'fa-regular fa-bars', displayName: 'Banner', description: 'A banner with text and image' },
        { name: 'cards', icon: 'fa-regular fa-id-card', displayName: 'Cards', description: 'A series of vertically arranged cards' },
        { name: 'magic-block', icon: 'fa-regular fa-magic', displayName: 'Magic Block', description: 'Bring your own blocks with handlebars' },
      ],
      addMenuVisible: false,
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    showBlockName(block) {
      // Implement show block name logic if needed
    },
    hideBlockName() {
      // Implement hide block name logic if needed
    },
    selectBlock(block) {
      console.log(`Selected block: ${block.name}`);
      // Implement block selection logic
    },
    toggleAddMenu() {
      this.addMenuVisible = !this.addMenuVisible;
    },
    addBlock(block) {
      this.$emit('add-block', block);
      this.addMenuVisible = false;
    },
    handleClickOutside(event) {
      const addBlockMenu = this.$refs.addBlockMenu ? this.$refs.addBlockMenu.$el : null;
      if (this.addMenuVisible && !this.$el.contains(event.target) && !(addBlockMenu && addBlockMenu.contains(event.target))) {
        this.addMenuVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 50px;
  height:100%;
  background-color: #f4f4f4;
  padding: 2;
  border-right: 1px solid #ddd;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 999;
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

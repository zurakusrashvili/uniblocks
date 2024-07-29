<template>
    <div class="add-menu" v-show="visible">
      <div class="block-section">
        <h3>BASIC BLOCKS</h3>
        <ul>
          <li v-for="block in basicBlocks" :key="block.name" @click="selectBlock(block)">
            <i :class="block.icon"></i>
            <div>
              <span class="block-name">{{ block.displayName }}</span>
              <span class="block-description">{{ block.description }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="block-section">
        <h3>ADVANCED BLOCKS</h3>
        <ul>
          <li v-for="block in advancedBlocks" :key="block.name" @click="selectBlock(block)">
            <i :class="block.icon"></i>
            <div>
              <span class="block-name">{{ block.displayName }}</span>
              <span class="block-description">{{ block.description }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AddBlockMenu',
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      basicBlocks: {
        type: Array,
        required: true,
      },
      advancedBlocks: {
        type: Array,
        required: true,
      },
    },
    methods: {
      selectBlock(block) {
        this.$emit('add-block', block);
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .add-menu {
    position: absolute;
    bottom: 0px;
    left: 50px;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    width: 300px;
    z-index: 10;
    padding: 10px;
  
    .block-section {
      margin-bottom: 20px;
  
      h3 {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        text-transform: uppercase;
        text-align: start;
      }
  
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
  
        li {
          display: flex;
          align-items: center;
          padding: 10px 0;
          cursor: pointer;
          position: relative;
  
          div {
            display: flex;
            flex-direction: column;
            text-align: start;
            gap: 3px;
          }
  
          i {
            margin-right: 10px;
            font-size: 18px;
          }
  
          &:hover {
            background-color: #f4f4f4;
          }
  
          .block-name {
            font-size: 14px;
            font-weight: bold;
          }
  
          .block-description {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
  </style>
  
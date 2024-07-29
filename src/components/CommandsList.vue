<template>
  <div class="bg-white border border-slate-400 rounded overflow-hidden shadow">
    <template v-if="basicBlocks.length || advancedBlocks.length">
      <div v-if="basicBlocks.length">
        <div class="p-2 text-slate-600 text-sm w-full font-bold">Basic Blocks</div>
        <button class="flex flex-row gap-2 items-center w-full p-2 pr-12 text-slate-600 hover:bg-slate-50 text-sm"
          :class="{ 'bg-slate-100': index === selectedIndex && isBasic }" v-for="(item, index) in basicBlocks"
          :key="index" @click.prevent="selectItem(index, true)">
          <div class="item">
            <span class="icon" v-html="item.icon"> </span>
            <div>
              <span class="title">{{ item.title }}</span>
              <span class="description">{{ item.description }}</span>
            </div>
          </div>
        </button>
      </div>
      <div v-if="advancedBlocks.length">
        <div class="p-2 text-slate-600 text-sm w-full font-bold">Advanced Blocks</div>
        <button class="flex flex-row gap-2 items-center w-full p-2 pr-12 text-slate-600 hover:bg-slate-50 text-sm"
          :class="{ 'bg-slate-100': index === selectedIndex && !isBasic }" v-for="(item, index) in advancedBlocks"
          :key="index" @click.prevent="selectItem(index, false)">
          <div class="item">
            <span class="icon" v-html="item.icon"> </span>
            <div>
              <span class="title">{{ item.title }}</span>
              <span class="description">{{ item.description }}</span>
            </div>
          </div>
        </button>
      </div>
    </template>
    <div class="p-2 text-slate-600 text-sm w-full" v-else>No result</div>
  </div>
</template>


<script>
export default {
  props: {
    basicBlocks: {
      type: Array,
      required: true,
    },
    advancedBlocks: {
      type: Array,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
      isBasic: true,
    };
  },

  watch: {
    basicBlocks() {
      this.selectedIndex = 0;
      this.isBasic = true;
    },
    advancedBlocks() {
      this.selectedIndex = 0;
      this.isBasic = false;
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === "ArrowUp") {
        this.upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        this.downHandler();
        return true;
      }

      if (event.key === "Enter") {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler() {
      if (this.isBasic) {
        this.selectedIndex =
          (this.selectedIndex + this.basicBlocks.length - 1) % this.basicBlocks.length;
      } else {
        this.selectedIndex =
          (this.selectedIndex + this.advancedBlocks.length - 1) % this.advancedBlocks.length;
      }
    },

    downHandler() {
      if (this.isBasic) {
        this.selectedIndex = (this.selectedIndex + 1) % this.basicBlocks.length;
      } else {
        this.selectedIndex = (this.selectedIndex + 1) % this.advancedBlocks.length;
      }
    },

    enterHandler() {
      this.selectItem(this.selectedIndex, this.isBasic);
    },

    selectItem(index, isBasic) {
      const item = isBasic ? this.basicBlocks[index] : this.advancedBlocks[index];

      if (item) {
        this.command(item);
      }
    },
  },
};
</script>



<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  gap: 15px;

  .icon {
    font-size: 20px;
  }



  div {
    display: flex;
    flex-direction: column;
    text-align: start;


    .title {
      font-weight: bold;
    }
  }
}
</style>
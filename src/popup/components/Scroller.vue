<script setup lang="ts">
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { RecycleScroller } from 'vue-virtual-scroller'

interface Props {
  retailers?: Retailer[],
}

const props = withDefaults(defineProps<Props>(), {
  retailers: () => [],
})

const onClickRetailer = (retailer: Retailer) => chrome.runtime.sendMessage({ type: 'visit_url', url: retailer.su })
</script>

<template>
  <!-- <div class="scroller"> -->
  <RecycleScroller class="scroller" :items="props.retailers" :item-size="73" key-field="mi" v-slot="{ item }">
    <div class="container">
      <div class="item" @click="onClickRetailer(item)">
        <div class="item-inner">
          <div class="text">
            <div class="title">{{ item.n }}</div>
            <div class="rate">{{ item.r }}</div>
          </div>
          <div class="arrow">
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492.004 492.004">
              <path fill="currentColor"
                d="M382.678 226.804L163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </RecycleScroller>
  <!-- </div> -->
</template>

<style scoped>
.scroller {
  height: 100%;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  border: 1px solid #a9a8a9;
}

.scroller::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.scroller::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.scroller::-webkit-scrollbar-thumb {
  background: #2a78cd;
}

/* Handle on hover */
.scroller::-webkit-scrollbar-thumb:hover {
  background: #5493d7;
}

.item {
  padding: 4px 12px;
  border-bottom: 1px solid #a1a1a1;
  box-sizing: border-box;
}

.item-inner {
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 8px 4px;

}

.item:hover {
  background-color: #e5e5e5;
}


.item:hover .arrow {
  transform: translateX(5px);
}


.title {
  display: block;
  font-weight: bold;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  height: 12px;
  margin-right: 20px;
  width: 12px;
  transition: all .3s ease;
}

.svg {
  display: block;
}
</style>
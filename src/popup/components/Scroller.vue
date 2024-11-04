<script setup lang="ts">
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { RecycleScroller } from "vue-virtual-scroller";

interface Props {
    retailers?: Retailer[];
}

const props = withDefaults(defineProps<Props>(), {
    retailers: () => [],
});

const onClickRetailer = ({ su }: Retailer) =>
    chrome.runtime.sendMessage({ type: "visit_url", url: su });
</script>

<template>
    <!-- <div class="scroller"> -->
    <RecycleScroller
        class="scroller"
        :items="props.retailers"
        :item-size="73"
        key-field="mi"
        v-slot="{ item }"
    >
        <div class="container">
            <div class="item" @click="onClickRetailer(item)">
                <div class="item-inner">
                    <img class="image" :src="item.l" />
                    <div class="text">
                        <div class="title">{{ item.n }}</div>
                        <div class="rate">{{ item.r }}</div>
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
    scrollbar-gutter: stable;
}

::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #2a78cd;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #5493d7;
}

.item {
    padding: 4px 12px;
    border-bottom: 1px solid #a1a1a1;
    box-sizing: border-box;
}

.item:hover {
    background-color: #e5e5e5;
}

.item-inner {
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 8px 4px;
}

.image {
    width: 70px;
    padding-right: 12px;
}

.text {
    flex: 1;
}

.title {
    display: block;
    font-weight: bold;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

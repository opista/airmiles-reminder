<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from "vue";
import Scroller from "./components/Scroller.vue";

const retailers = ref<Retailer[]>([]);
const searchInput = ref<HTMLInputElement | null>(null);
const searchTerm = ref<string>("");

const filteredRetailers = computed(() =>
    searchTerm.value
        ? retailers.value.filter(({ n }) =>
            n.toLocaleLowerCase().includes(searchTerm.value.toLocaleLowerCase()),
        )
        : retailers.value,
);

onBeforeMount(() => {
    chrome.storage.local.get("retailer_list", (result) => {
        retailers.value = result?.retailer_list?.retailers || [];
    });
});

onMounted(() => {
    searchInput?.value?.focus();
});

const visitUrl = (url: string) => chrome.runtime.sendMessage({ type: "visit_url", url });

const onClickFaq = () => visitUrl("https://www.opista.com/apps/airmiles-reminder#faq");
</script>

<template>
    <div class="container">
        <div class="header">
            <img class="logo" src="/img/logo-128.png" alt="test" />
            <h1>Airmiles Reminder</h1>
        </div>
        <input type="text" v-model="searchTerm" placeholder="Search for a retailer" ref="searchInput" />
        <Scroller :retailers="filteredRetailers" />
        <div class="footer">
            <button class="button button-faq" title="Frequently Asked Questions" @click="onClickFaq">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 52 52">
                    <path fill="currentColor"
                        d="M26.7 42.8c.8 0 1.5.7 1.5 1.5v3.2c0 .8-.7 1.5-1.5 1.5h-3.2c-.8 0-1.5-.7-1.5-1.5v-3.2c0-.8.7-1.5 1.5-1.5h3.2zM28.2 35.1c0-2.1 1.3-4 3.1-4.8h.1c5.2-2.1 8.8-7.2 8.8-13.2 0-7.8-6.4-14.2-14.2-14.2-7.2 0-13.2 5.3-14.2 12.2v.1c-.1.9.6 1.6 1.5 1.6h3.2c.8 0 1.4-.5 1.5-1.1v-.2c.7-3.7 4-6.5 7.9-6.5 4.5 0 8.1 3.6 8.1 8.1 0 2.1-.8 4-2.1 5.5l-.1.1c-.9 1-2.1 1.6-3.3 2-4 1.4-6.7 5.2-6.7 9.4v1.5c0 .8.6 1.4 1.4 1.4h3.2c.8 0 1.6-.6 1.6-1.5l.2-.4z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style>
body {
    -webkit-font-smoothing: antialiased;
    background: #fff;
    font-size: 16px;
    color: #021b41;
    font-family: "Mylius Modern", helvetica, arial, sans-serif;
    line-height: 1.5;
    margin: 0;
    padding: 16px 12px;
}
</style>

<style scoped>
.header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.logo {
    width: 32px;
}

h1 {
    font-size: 20px;
    line-height: 1;
    margin: 0 0 0 12px;
}

.footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

input {
    background-color: #f5f5f5;
    border: none;
    outline: none;
    border-bottom: 2px solid #a9a8a9;
    box-sizing: border-box;
    color: #656b6f;
    font-size: inherit;
    line-height: 1.15;
    margin: 0 0 16px;
    padding: 10px;
    width: 100%;
}

.button {
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: block;
    line-height: 16px;
    margin: 0;
    padding: 8px 12px;
    text-align: center;
    text-decoration: none;
}

.button-faq {
    padding: 6px;
    width: 32px;
    height: 32px;
    color: #0032a0;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #0032a0;
}

.button-faq svg {
    display: block;
}

.button-faq:hover {
    background-color: #d5ddff;
}

.container {
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 300px;
}
</style>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import Scroller from './components/Scroller.vue'

const retailers = ref<Retailer[]>([])
const searchInput = ref<HTMLInputElement | null>(null)
const searchTerm = ref<string>("")

const sortedRetailers = computed(() => retailers.value.sort((a, b) => a.merchant.slug.localeCompare(b.merchant.slug)))
const filteredRetailers = computed(() => searchTerm.value ? sortedRetailers.value.filter(({ merchant_url }) => merchant_url.toLocaleLowerCase().includes(searchTerm.value.toLocaleLowerCase())) : sortedRetailers.value)

onBeforeMount(() => {
  chrome.storage.local.get('retailer_list', (result) => {
    retailers.value = (result?.retailer_list?.retailers) || []
  })
})

onMounted(() => {
  searchInput?.value?.focus()
})

const visitUrl = (url: string) => chrome.runtime.sendMessage({ type: 'visit_url', url })

const onClickBaShopping = () => visitUrl("https://www.shopping.ba.com/")
const onClickFaq = () => visitUrl("https://www.opista.com/apps/avios-reminder#faq")

</script>

<template>
  <div class="container">
    <div class="header">
      <img class="logo" src="/img/logo-128.png" alt="test">
      <h1>Avios Reminder</h1>
    </div>
    <input type="text" v-model="searchTerm" placeholder="Search for a retailer" ref="searchInput">
    <Scroller :retailers="filteredRetailers" />
    <div class="footer">
      <button class="button button-ba" title="Visit the BA Shopping website" @click="onClickBaShopping">BA
        Shopping</button>
      <button class="button button-faq" title="Frequently Asked Questions" @click="onClickFaq">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 10a3 3 0 1 1 3 3v1m-7 7h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
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
  font-family: 'Mylius Modern', helvetica, arial, sans-serif;
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
  justify-content: space-between;
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

.button-ba {
  margin-right: 8px;
  color: #fff;
  background: #2a78cd;
}

.button-ba:hover {
  background-color: #5493d7;
}

.button-faq {
  padding: 4px;
  color: #fff;
  background-color: #bb5ce3;
}

.button-faq svg {
  display: block;
  width: 24px;
  height: 24px;
}

.button-faq:hover {
  background-color: #d285f3;
}

.container {
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 300px;
}
</style>
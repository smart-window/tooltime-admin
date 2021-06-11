<template>
  <div class="d-flex flex-wrap align-items-center">
    <div class="mr-auto">
      <p class="text-uppercase font-weight-bold mb-1">TOTAL PRODUCTS</p>
      <p class="mb-0">All Products</p>
    </div>
    <p class="font-weight-bold font-size-24 mb-0">
      {{ this.products.length }}
    </p>
  </div>
</template>
<script>
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  name: 'TotalProducts',
  data: function () {
    return {
      products: [],
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      this.fetching = true
      try {
        this.products = await API.getProducts()
        this.filteredProducts = this.products
        this.fetching = false
      } catch (e) {
        message.error(e.message)
        this.fetching = false
      }
    },
  },
}
</script>

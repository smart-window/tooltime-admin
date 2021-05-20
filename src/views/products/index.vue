<template>
  <div>
    <div class="cui__utils__heading">
      <strong>Ecommerce: Product Catalog</strong>
    </div>
    <a-row gutter="16">
      <a-col :style="{ textAlign: 'right' }">
        <a-button type="primary" @click="handleAddProduct"> Add product </a-button>
      </a-col>
    </a-row>
    <div class="row">
      <div class="col-xl-4 col-lg-6" v-for="(product, index) in products" :key="index">
        <product-card
          :isNew="product.isNew"
          :isFavorite="product.isFavorite"
          :imagesStr="product.images"
          :name="product.name"
          :price="product.price"
          :oldPrice="product.oldPrice"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ProductCard from './ProductCard'
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  components: {
    ProductCard,
  },
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
      try {
        this.products = await API.getProducts()
      } catch (e) {
        message.error(e.message)
      }
    },

    handleAddProduct(event) {
      event.preventDefault()
    },
  },
}
</script>

<template>
  <div>
    <!-- <div class="cui__utils__heading">
      <strong>Ecommerce: Product Catalog</strong>
    </div>
    <div class="row">
      <a-button> Add product </a-button>
    </div> -->
    <div class="row">
      <div class="col-xl-4 col-lg-6" v-for="(product, index) in products" :key="index">
        <cui-general-16
          :isNew="product.isNew"
          :isFavorite="product.isFavorite"
          :image="product.image"
          :name="product.name"
          :price="product.price"
          :oldPrice="product.oldPrice"
        />
      </div>
    </div>
  </div>
</template>
<script>
import CuiGeneral16 from '@/components/kit/widgets/General/16/index'
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  name: 'ProductCategory',
  components: {
    CuiGeneral16,
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
      this.fetching = true
      try {
        const dbProducts = await API.getProducts()
        dbProducts.map((product, index) => {
          if (index > 5) {
            return
          }
          const params = {
            isNew: false,
            isFavorite: false,
            image: product.images.split(',')[0],
            name: product.name,
            price: '',
            oldPrice: '',
          }
          this.products.push(params)
        })
        this.fetching = false
      } catch (e) {
        message.error(e.message)
        this.fetching = false
      }
    },
  },
}
</script>

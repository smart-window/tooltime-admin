<template>
  <div class="d-flex flex-wrap align-items-center">
    <div class="mr-auto">
      <p class="text-uppercase font-weight-bold mb-1">TOTAL ORDERS</p>
      <p class="mb-0">All Orders</p>
    </div>
    <p class="font-weight-bold font-size-24 mb-0">{{ this.orders.length }}</p>
  </div>
</template>
<script>
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  name: 'TotalOrders',
  data: function () {
    return {
      orders: [],
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.fetching = true
      try {
        this.orders = await API.getOrders()
        this.filteredOrders = this.orders
        this.fetching = false
      } catch (e) {
        message.error(e.message)
        this.fetching = false
      }
    },
  },
}
</script>

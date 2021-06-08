<template>
  <div class="d-flex flex-wrap align-items-center">
    <div class="mr-auto">
      <p class="text-uppercase font-weight-bold mb-1">TOTAL ASSETS</p>
      <p class="mb-0">All Assets</p>
    </div>
    <p class="font-weight-bold font-size-24 mb-0">{{ this.assets.length }}</p>
  </div>
</template>
<script>
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  name: 'TotalAssets',
  data: function () {
    return {
      assets: [],
    }
  },
  mounted() {
    this.fetchAssets()
  },
  methods: {
    async fetchAssets() {
      this.fetching = true
      try {
        this.assets = await API.getAssets()
        this.filteredAssets = this.assets
        this.fetching = false
      } catch (e) {
        message.error(e.message)
        this.fetching = false
      }
    },
  },
}
</script>

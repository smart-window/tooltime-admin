<template>
  <div class="d-flex flex-wrap align-items-center">
    <div class="mr-auto">
      <p class="text-uppercase font-weight-bold mb-1">Service Areas</p>
      <p class="mb-0">All Service Areas</p>
    </div>
    <p class="font-weight-bold font-size-24 mb-0">{{ this.serviceAreas.length }}</p>
  </div>
</template>
<script>
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  name: 'ServiceAreas',
  data: function () {
    return {
      serviceAreas: [],
    }
  },
  mounted() {
    this.fetchServiceAreas()
  },
  methods: {
    async fetchServiceAreas() {
      this.fetching = true
      try {
        this.serviceAreas = await API.getServiceAreas()
        this.filteredServiceAreas = this.serviceAreas
        this.fetching = false
      } catch (e) {
        message.error(e.message)
        this.fetching = false
      }
    },
  },
}
</script>

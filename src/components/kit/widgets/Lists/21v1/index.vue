<template>
  <div class="card bg-light">
    <div class="card-body">
      <div class="pt-5 pb-5 pl-5 pr-5 text-center flex-grow-1">
        <i class="fe fe-cpu font-size-80 mb-3 d-block" />
        <div class="text-dark font-weight-bold font-size-36">Standart</div>
        <div class="text-dark font-weight-bold font-size-48 mb-3">
          $49 <span class="align-text-top font-size-28 text-gray-6">/mo</span>
        </div>
        <ul class="list-unstyled font-size-18 mb-5">
          <li>20GB of Bandwidth</li>
          <li>400MB Max File Size</li>
          <li>2GHZ CPU</li>
          <li>512MB Memory</li>
          <li>2 GB Storage</li>
        </ul>
        <input type="hidden" id="basicPrice" name="priceId" />
        <a class="btn btn-primary width-100" @click="handleSubmit(priceId.basicPrice)">Get Access</a>
      </div>
    </div>
  </div>
</template>
<script>
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  name: 'KitList21v1',
  data() {
    return {
      priceId: {},
    }
  },
  async created() {
    this.priceId = await API.getPriceId()
  },
  methods: {
    async handleSubmit(pId) {
      try {
        const params = {
          priceId: pId,
        }
        await API.createCheckoutSession(params)
      } catch (e) {
        message.error(e.message)
      }
    },
  },
}
</script>

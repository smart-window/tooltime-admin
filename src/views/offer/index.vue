<template>
  <div>
    <div class="kit__utils__heading">
      <h5>Pricing Tables</h5>
    </div>
    <div class="row">
      <div class="col-lg-4">
        <kit-list-21 />
      </div>
      <div class="col-lg-4">
        <kit-list-21v1 />
      </div>
      <div class="col-lg-4">
        <kit-list-21v2 />
      </div>
    </div>
  </div>
</template>
<script>
import KitList21 from '@/components/kit/widgets/Lists/21'
import KitList21v1 from '@/components/kit/widgets/Lists/21v1'
import KitList21v2 from '@/components/kit/widgets/Lists/21v2'
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  components: {
    KitList21,
    KitList21v1,
    KitList21v2,
  },

  mounted() {
    if (this.$route.query.session_id) {
      this.handleSubmit()
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const res = await API.checkoutSession(this.$route.query.session_id)
        console.log(res)
        alert('Congratuations! You phurchased a plan!')
      } catch (e) {
        message.error(e.message)
      }
    },
  },
}
</script>

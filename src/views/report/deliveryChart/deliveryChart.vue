<template>
  <div>
    <vue-chartist
      class="height-200 mb-3"
      type="Bar"
      :data="data"
      :options="options"
      :listener="listener"
    />
    <div class="d-flex flex-wrap">
      <div class="mr-5 mb-2">
        <div class="text-nowrap text-uppercase text-gray-4">
          <div :class="[$style.donut, $style.warning]" />
          Delivery Count
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueChartist from 'v-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

export default {
  name: 'DeliveryChart',
  props: ['type'],
  components: {
    'vue-chartist': VueChartist,
  },
  data: function () {
    const options = {
      low: 0,
      fullWidth: true,
      showPoint: true,
      lineSmooth: true,
      axisY: {
        showGrid: true,
        showLabel: true,
        // offset: 40,
      },
      axisX: {
        showGrid: true,
        showLabel: true,
        // offset: 40,
      },
      showArea: true,
      plugins: [ChartistTooltip({ anchorToPoint: false, appendToBody: true, seriesName: false })],
    }
    const listener = {
      draw: (item) => {
        if (item.type === 'bar') {
          item.group.elem('line', {
            x1: item.x1,
            x2: item.x2,
            y1: item.y2,
            y2: 0,
            stroke: '#e4e9f0',
            'stroke-width': '10',
          })
        }
      },
    }
    return {
      data: {
        labels: [],
        series: [
          {
            className: 'ct-series-c',
            data: [],
          },
        ],
      },
      options,
      listener,
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
        this.orders = await API.getDeliveryCount({ type: this.type })
        this.filteredOrders = this.orders
        this.fetching = false

        this.orders[0].map((order) => {
          this.data.labels.push(order.selected_date)
          this.data.series[0].data.push(order.order_num)
        })
      } catch (e) {
        message.error(e.message)
        this.fetching = false
      }
    },
  },
}
</script>
<style lang="scss" module>
@import './style.module.scss';
</style>

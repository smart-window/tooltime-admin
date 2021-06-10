<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="filteredOrders"
      :showHeader="false"
      :pagination="false"
      rowKey="id"
      :defaultSortOrder="defaultSortOrder"
      class="table table-borderless text-gray-6 mb-0"
    >
      <li slot="order" slot-scope="text, record" :class="$style.item">
        <a href="javascript: void(0);" :class="$style.itemLink">
          <div :class="$style.itemMeta" class="font-weight-bold text-danger">
            {{ formatTime(record.createdAt) }}
          </div>
          <div class="mr-3">
            <div>New order requested</div>
            <!-- <div>{{ record.name }}</div> -->
            <div class="text-muted">
              {{ record.Customer.name }} ordered
              {{
                record.OrderItems.reduce((productCount, orderItem) => {
                  return productCount + orderItem.orderCount
                }, 0)
              }}x products
            </div>
          </div>
          <div :class="$style.itemAction">
            <span />
            <span />
          </div>
        </a>
      </li>
    </a-table>
  </div>
</template>
<script>
import * as API from '@/services/api'
import { message } from 'ant-design-vue'
import moment from 'moment'

const columns = [
  {
    title: '',
    dataIndex: '',
    key: 'order',
    sorter: (a, b) => (a > b ? 1 : -1),
    scopedSlots: { customRender: 'order' },
  },
]

export default {
  name: 'KitList3',
  data: function () {
    return {
      orders: [],
      filteredOrders: [],
      columns,
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    formatTime(date) {
      return moment(date).format('H:M A')
    },
    formatDate(date) {
      return moment(date).format('D MMM')
    },
    defaultSortOrder() {
      return {
        columnTitle: 'createdAt',
        sortOrder: 'ascend' | 'descend',
      }
    },
    async fetchOrders() {
      this.fetching = true
      try {
        this.orders = await API.getOrders()
        this.orders.map((order, index) => {
          if (index < 5) {
            this.filteredOrders.push(order)
          }
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
<style lang="scss" module>
@import './style.module.scss';
</style>

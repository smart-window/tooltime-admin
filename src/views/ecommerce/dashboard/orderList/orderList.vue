<template>
  <div>
    <div class="mb-3">
      <div class="bg-success text-white text-uppercase px-3 py-1 mb-2">Recent Orders</div>
      <div class="table-responsive">
        <a-table
          :columns="columns"
          :dataSource="filteredOrders"
          :showHeader="false"
          :pagination="false"
          rowKey="id"
          :defaultSortOrder="defaultSortOrder"
          class="table table-borderless text-gray-6 mb-0"
        >
          <tr slot="name" slot-scope="text, record">
            <td class="text-nowrap">
              <div class="mr-3" :class="[$style.donut, $style.success]" />
              {{ record.name }}
            </td>
            <td class="text-right">
              <strong>{{ formatDate(record.createdAt) }}</strong>
            </td>
          </tr>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import * as API from '@/services/api'
import { message } from 'ant-design-vue'
import moment from 'moment'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => (a > b ? 1 : -1),
    scopedSlots: { customRender: 'name' },
  },
]
export default {
  name: 'OrderList',
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
    formatDate(date) {
      return moment(date).format('MMM DD, YYYY')
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
        console.log(this.filteredOrders)
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

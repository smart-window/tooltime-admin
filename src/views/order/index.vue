<template>
  <div>
    <edit-panel
      :showPanel="showEditPanel"
      :item="selected"
      :editing="isEditing"
      @submit="handleSubmit"
      @close="handleCloseEditingPanel"
      @onEdit="handleClickEdit"
      @onCancelEdit="handleClickCancelEdit"
    />
    <div class="cui__utils__heading">
      <strong>Orders</strong>
    </div>
    <div class="card">
      <div class="card-header card-header-flex">
        <div class="d-flex flex-column justify-content-center">
          <h5 class="mb-0">Orders</h5>
        </div>
        <div class="d-flex flex-column justify-content-center mr-auto">
          <a-select
            default-value="All"
            v-bind:style="{ width: '200px', marginLeft: '100px' }"
            @change="handleStatusChange"
          >
            <a-select-option v-for="statusOption in statusOptions" :key="statusOption">
              {{ statusOption }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="card-body">
        <a-table rowKey="id" :columns="columns" :dataSource="filteredOrders">
          <template slot="no" slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
          <div
            slot="filterDropdown"
            slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
            class="custom-filter-dropdown"
          >
            <a-input
              v-ant-ref="(c) => (searchInput = c)"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="() => handleSearch(selectedKeys, confirm)"
              style="width: 188px; margin-bottom: 8px; display: block"
            />
            <a-button
              type="primary"
              @click="() => handleSearch(selectedKeys, confirm)"
              size="small"
              style="width: 90px; margin-right: 8px"
              >Search</a-button
            >
            <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px"
              >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <template slot="customer" slot-scope="text">
            <span v-if="searchText">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                  >{{ fragment }}</mark
                >
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              <a class="btn btn-sm btn-light" href="javascript: void(0);">{{ text }}</a>
            </template>
          </template>
          <template slot="progress" slot-scope="bar">
            <div class="progress">
              <div
                :class="['progress-bar', bar.color]"
                :style="{ width: bar.value + '%' }"
                role="progressbar"
              ></div>
            </div>
          </template>
          <template slot="value" slot-scope="text">
            <span class="font-weight-bold">{{ text }}</span>
          </template>
          <a slot="id" slot-scope="text" href="javascript: void(0);" class="btn btn-sm btn-light">{{
            text
          }}</a>
          <span slot="customer" slot-scope="customer">{{ customer.name }}</span>
          <span slot="location" slot-scope="location">{{ location.name }}</span>
          <span slot="productCount" slot-scope="orderItems" :class="getCountClass(orderItems)">
            {{
              orderItems
                .map((orderItem) => {
                  return orderItem.Product.Assets.reduce((count, asset) => {
                    if (asset.orderItemId === orderItem.id) {
                      count++
                    }
                    return count
                  }, 0)
                })
                .reduce((a, b) => a + b, 0)
            }}
            /
            {{
              orderItems.reduce((productCount, orderItem) => {
                return productCount + orderItem.orderCount
              }, 0)
            }}
          </span>
          <span slot="address" slot-scope="order">{{
            order.state + ', ' + order.city + ', ' + order.address + ',' + order.zip
          }}</span>
          <span slot="updatedAt" slot-scope="date">{{ formatDate(date) }}</span>
          <span slot="status" slot-scope="text" :class="statusClassName(text)">{{ text }}</span>
          <span slot="action" slot-scope="record">
            <a
              v-if="record.status === 'PENDING'"
              class="btn btn-sm btn-primary mr-2"
              @click="handleSubmit(record, { status: 'PICKED' })"
            >
              <a-icon type="shopping-cart" />
              Pick
            </a>
            <a
              v-if="record.status === 'PICKED'"
              class="btn btn-sm btn-success mr-2"
              @click="handleSubmit(record, { status: 'DELIVERED' })"
            >
              <a-icon type="cloud-upload" />
              Delivery
            </a>
            <a
              v-if="record.status === 'DELIVERED'"
              class="btn btn-sm btn-default mr-2"
              @click="handleSubmit(record, { status: 'RETURNED' })"
            >
              <a-icon type="sync" />
              Return
            </a>
            <a @click="handleViewRecord(record.id)" class="btn btn-sm btn-light mr-2">
              <i class="fe fe-edit mr-2" />
              View
            </a>
            <a-popconfirm
              title="Are you sure delete this order?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleRemoveRecord(record.id)"
            >
              <a href="#" class="btn btn-sm btn-danger">
                <small>
                  <i class="fe fe-trash mr-2" />
                </small>
                Remove
              </a>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import * as API from '@/services/api'
import moment from 'moment'
import { message } from 'ant-design-vue'
import EditPanel from './EditPanel'
import * as _ from 'lodash'

const STATUS = {
  PENDING: 'PENDING',
  PICKED: 'PICKED',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  EXPIRED: 'EXPIRED',
}

const statusOptions = [
  'All',
  STATUS.PENDING,
  STATUS.PICKED,
  STATUS.DELIVERED,
  STATUS.RETURNED,
  STATUS.EXPIRED,
]

const columns = [
  {
    title: 'No',
    key: 'no',
    scopedSlots: { customRender: 'no' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Order Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Customer Name',
    dataIndex: 'Customer',
    key: 'customerName',
    scopedSlots: { customRender: 'customer' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Location',
    dataIndex: 'Location',
    key: 'locationName',
    scopedSlots: { customRender: 'location' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Product Count',
    dataIndex: 'OrderItems',
    key: 'productCount',
    scopedSlots: { customRender: 'productCount' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Address',
    dataIndex: '',
    key: 'address',
    scopedSlots: { customRender: 'address' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  components: { EditPanel },
  data: function () {
    return {
      searchText: '',
      searchInput: null,
      orders: [],
      columns,
      showEditPanel: false,
      isEditing: false,
      isCreating: false,
      fetching: false,
      selected: {},
      statusOptions: statusOptions,
      filteredOrders: [],
    }
  },

  mounted() {
    this.fetchOrders()
  },

  computed: {
    panelTitle() {
      return this.isEditing ? 'Edit a order' : 'Create a new order'
    },
  },
  methods: {
    handleSearch(selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },

    handleReset(clearFilters) {
      clearFilters()
      this.searchText = ''
    },

    handleClickNew(event) {
      event.preventDefault()
      this.isEditing = true
      this.showEditPanel = true
      this.selected = {}
    },

    handleCloseEditingPanel() {
      this.showEditPanel = false
      this.fetchOrders()
    },

    handleClickEdit() {
      this.isEditing = true
    },
    handleClickCancelEdit() {
      this.isEditing = false
    },
    async handleSubmit(record, params) {
      try {
        const pickCount = record.OrderItems.map((orderItem) => {
          return orderItem.Product.Assets.reduce((count, asset) => {
            if (asset.orderItemId === orderItem.id) {
              count++
            }
            return count
          }, 0)
        }).reduce((a, b) => a + b, 0)
        const totalCount = record.OrderItems.reduce((productCount, orderItem) => {
          return productCount + orderItem.orderCount
        }, 0)
        if (totalCount === pickCount) {
          await API.updateOrder(record.id, params)
          message.success('Order is updated.')
          this.showEditPanel = false
          this.fetchOrders()
        } else {
          message.warning('Please pick items first.')
        }
      } catch (e) {
        message.error(e.message)
      }
    },

    handleViewRecord(orderId) {
      this.selected = this.orders.find((order) => order.id === orderId)
      this.showEditPanel = true
      this.isEditing = false
    },

    async handleRemoveRecord(orderId) {
      try {
        await API.removeOrder(orderId)
        message.info('Order Removed!')
        this.orders = _.cloneDeep(this.orders).filter((order) => order.id !== orderId)
      } catch (e) {
        message.error(e.message)
      }
    },

    formatDate(date) {
      return moment(date).format('YYYY MMM DD HH:mm')
    },

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

    statusClassName(status) {
      if (status === STATUS.PENDING) return 'font-size-12 badge badge-warning'
      if (status === STATUS.PICKED) return 'font-size-12 badge badge-primary'
      if (status === STATUS.DELIVERED) return 'font-size-12 badge badge-success'
      if (status === STATUS.RETURNED) return 'font-size-12 badge badge-default'
      if (status === STATUS.EXPIRED) return 'font-size-12 badge badge-default'
    },

    getCountClass(orderItems) {
      const pick = orderItems
        .map((orderItem) => {
          return orderItem.Product.Assets.reduce((count, asset) => {
            if (asset.orderItemId === orderItem.id) {
              count++
            }
            return count
          }, 0)
        })
        .reduce((a, b) => a + b, 0)
      const total = orderItems.reduce((productCount, orderItem) => {
        return productCount + orderItem.orderCount
      }, 0)

      if (pick === total) {
        return 'font-size-12 badge badge-success'
      } else {
        return 'font-size-12 badge badge-danger'
      }
    },

    handleStatusChange(status) {
      this.filteredOrders = []
      if (status === 'All') {
        this.filteredOrders = this.orders
      } else {
        this.orders.find((_value) => {
          if (_value.status === status) {
            this.filteredOrders.push(_value)
          }
        })
      }
    },
  },
}
</script>
<style scoped>
.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>

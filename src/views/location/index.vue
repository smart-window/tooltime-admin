<template>
  <div>
    <edit-panel
      title="Edit Location"
      :showPanel="showEditPanel"
      :item="selected"
      :editing="isEditing"
      @submit="handleSubmit"
      @close="handleCloseEditingPanel"
      @onEdit="handleClickEdit"
    />
    <div class="cui__utils__heading">
      <strong>Locations</strong>
    </div>
    <div class="card">
      <div class="card-header card-header-flex">
        <div class="d-flex flex-column justify-content-center mr-auto">
          <h5 class="mb-0">Latest Orders</h5>
        </div>
        <div class="d-flex flex-column justify-content-center">
          <a class="btn btn-primary" @click="handleNewOrder">New Location</a>
        </div>
      </div>
      <div class="card-body">
        <a-table :columns="columns" :dataSource="data">
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
          <span slot="total" slot-scope="text">${{ text }}</span>
          <span slot="updatedAt" slot-scope="date">{{ formatDate(date) }}</span>
          <span slot="tax" slot-scope="text">${{ text }}</span>
          <span slot="shipping" slot-scope="text">${{ text }}</span>
          <span
            slot="status"
            slot-scope="text"
            :class="[
              text === 'Processing'
                ? 'font-size-12 badge badge-primary'
                : 'font-size-12 badge badge-default',
            ]"
            >{{ text }}</span
          >
          <span slot="action" slot-scope="record">
            <a @click="handleViewRecord(record.id)" class="btn btn-sm btn-light mr-2">
              <i class="fe fe-edit mr-2" />
              View
            </a>
            <a @click="handleRemoveRecord(record.id)" class="btn btn-sm btn-danger">
              <small>
                <i class="fe fe-trash mr-2" />
              </small>
              Remove
            </a>
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

const columns = [
  {
    title: 'Address 1',
    dataIndex: 'address_1',
    key: 'address_1',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Address 2',
    dataIndex: 'address_2',
    key: 'address_2',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Last Update',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    scopedSlots: { customRender: 'updatedAt' },
  },
  {
    title: 'Zip Code',
    dataIndex: 'zip',
    key: 'zip',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  // {
  //   title: 'Customer',
  //   dataIndex: 'customer',
  //   sorter: (a, b) => a.customer.length - b.customer.length,
  //   scopedSlots: {
  //     filterDropdown: 'filterDropdown',
  //     filterIcon: 'filterIcon',
  //     customRender: 'customer',
  //   },
  //   onFilter: (value, record) => record.customer.toLowerCase().includes(value.toLowerCase()),
  // },
  // {
  //   title: 'Grand Total',
  //   dataIndex: 'total',
  //   sorter: (a, b) => a.total - b.total,
  //   scopedSlots: { customRender: 'total' },
  // },
  // {
  //   title: 'Tax',
  //   dataIndex: 'tax',
  //   sorter: (a, b) => a.tax - b.tax,
  //   scopedSlots: { customRender: 'tax' },
  // },
  // {
  //   title: 'Shipping',
  //   dataIndex: 'shipping',
  //   sorter: (a, b) => a.shipping - b.shipping,
  //   scopedSlots: { customRender: 'shipping' },
  // },
  // {
  //   title: 'Quantity',
  //   dataIndex: 'quantity',
  //   sorter: (a, b) => a.quantity - b.quantity,
  // },
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   sorter: (a, b) => a.status.length - b.status.length,
  //   scopedSlots: { customRender: 'status' },
  // },
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
      data: [],
      columns,
      showEditPanel: false,
      isEditing: false,
      isCreating: false,
      fetching: false,
      selected: {},
    }
  },

  mounted() {
    this.fetchLocations()
  },

  computed: {
    panelTitle() {
      return this.isEditing ? 'Edit a location' : 'Create a new location'
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

    handleNewOrder(event) {
      event.preventDefault()
      this.isEditing = true
      this.showEditPanel = true
      this.selected = {}
    },

    handleCloseEditingPanel() {
      this.showEditPanel = false
    },

    handleClickEdit() {
      this.isEditing = true
    },

    async handleSubmit(values) {
      try {
        if (!this.selected.id) await API.createLocation(values)
        else await API.updateLocation(this.selected.id, values)
        this.showEditPanel = false
        message.success('New loation created')
        this.fetchLocations()
      } catch (e) {
        message.error(e.message)
      }
    },

    handleViewRecord(locationId) {
      this.selected = this.data.find((location) => location.id === locationId)
      this.showEditPanel = true
      this.isEditing = false
    },

    async handleRemoveRecord(locationId) {
      try {
        await API.removeLocation(locationId)
        message.info('Location Removed!')
        this.data = _.cloneDeep(this.data).filter((location) => location.id !== locationId)
      } catch (e) {
        message.error(e.message)
      }
    },

    formatDate(date) {
      return moment(date).format('YYYY MMM DD HH:mm')
    },

    async fetchLocations() {
      this.fetching = true
      try {
        const res = await API.getLocations()
        this.data = res
        this.fetching = false
      } catch (e) {
        console.log(e.message)
        message.error(e.message)
        this.fetching = false
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

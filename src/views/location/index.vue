<template>
  <div>
    <a-drawer
      :title="panelTitle"
      :width="720"
      :visible="showEditPanel"
      :body-style="{ paddingBottom: '80px' }"
      @close="handleCloseEditingPanel"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Name">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: 'Location name required' }],
                  },
                ]"
                placeholder="Please enter location name"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Phone">
              <a-input
                v-decorator="[
                  'phone',
                  {
                    rules: [{ required: false }],
                  },
                ]"
                placeholder="Please enter phone"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Address">
              <a-input
                v-decorator="[
                  'address_1',
                  {
                    rules: [{ required: true, message: 'Address required' }],
                  },
                ]"
                placeholder="Please enter Address"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Address 2">
              <a-input
                v-decorator="[
                  'address_2',
                  {
                    rules: [{ required: false }],
                  },
                ]"
                placeholder="Please enter City"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="State">
              <a-input
                v-decorator="[
                  'state',
                  {
                    rules: [{ required: true, message: 'State required' }],
                  },
                ]"
                placeholder="Please enter state"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="City">
              <a-input
                v-decorator="[
                  'state',
                  {
                    rules: [{ required: true, message: 'City required' }],
                  },
                ]"
                placeholder="Please enter City"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Description">
              <a-textarea
                v-decorator="[
                  'description',
                  {
                    rules: [{ required: true, message: 'Please enter url description' }],
                  },
                ]"
                :rows="4"
                placeholder="please enter url description"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="handleCloseEditingPanel">
          Cancel
        </a-button>
        <a-button type="primary" @click="handleSubmit"> Submit </a-button>
      </div>
    </a-drawer>
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
          <span slot="action">
            <a href="javascript: void(0);" class="btn btn-sm btn-light mr-2">
              <i class="fe fe-edit mr-2" />
              View
            </a>
            <a href="javascript: void(0);" class="btn btn-sm btn-light">
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
  data: function () {
    return {
      searchText: '',
      searchInput: null,
      data: [],
      columns,
      showEditPanel: false,
      isEdit: false,
      fetching: false,
      form: this.$form.createForm(this, {}),
    }
  },

  async mounted() {
    try {
      const res = await API.getLocations()
      console.log('API.getLocations =>', res)
      this.data = res
    } catch (e) {
      console.log(e.message)
    }
  },

  computed: {
    panelTitle() {
      return this.isEdit ? 'Edit a location' : 'Create a new location'
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
      this.showEditPanel = true
    },

    handleCloseEditingPanel(event) {
      event.preventDefault()
      this.showEditPanel = false
    },

    handleSubmit(event) {
      event.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.showEditPanel = false
        }
      })
    },
    formatDate(date) {
      return moment(date).format('YYYY MMM DD HH:mm')
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

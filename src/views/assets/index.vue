<template>
  <div>
    <edit-panel
      title="Edit Asset"
      :showPanel="showEditPanel"
      :item="selected"
      :products="products"
      :editing="isEditing"
      @submit="handleSubmit"
      @close="handleCloseEditingPanel"
      @onEdit="handleClickEdit"
      @onCancelEdit="handleClickCancelEdit"
    />
    <div class="cui__utils__heading">
      <strong>Assets</strong>
    </div>
    <div class="card">
      <div class="card-header card-header-flex">
        <div class="d-flex flex-column justify-content-center">
          <h5 class="mb-0">Assets</h5>
        </div>
        <div class="d-flex flex-column justify-content-center mr-auto">
          <a-select
            default-value="*"
            v-bind:style="{ width: '200px', marginLeft: '100px' }"
            @change="handleLocationChange"
          >
            <a-select-option v-for="loc in tmpLocations" :key="loc.id" :value="loc.id">
              {{ loc.name }}
            </a-select-option>
          </a-select>
        </div>
        <div class="d-flex flex-column justify-content-center">
          <a class="btn btn-primary" @click="handleClickNew">New Asset</a>
        </div>
      </div>
      <div class="card-body">
        <a-table :columns="columns" :dataSource="filteredAssets" rowKey="id">
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
            >
              Search
            </a-button>
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
          <template slot="value" slot-scope="text">
            <span class="font-weight-bold">{{ text }}</span>
          </template>
          <a slot="id" slot-scope="text" href="javascript: void(0);" class="btn btn-sm btn-light">{{
            text
          }}</a>
          <a-tag color="green" slot="product" slot-scope="product">{{ product.name }}</a-tag>
          <span slot="location" slot-scope="location">{{ location.name }}</span>
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
            <a-popconfirm
              title="Are you sure delete this asset?"
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
import { mapState } from 'vuex'

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'Product',
    key: 'productName',
    scopedSlots: { customRender: 'product' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Manufacture',
    dataIndex: 'make',
    key: 'make',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Serial Number',
    dataIndex: 'sn',
    key: 'sn',
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
    title: 'Last Update',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    scopedSlots: { customRender: 'updatedAt' },
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
      assets: [],
      filteredAssets: [],
      products: [],
      columns,
      showEditPanel: false,
      isEditing: false,
      isCreating: false,
      fetching: false,
      selected: {},
      tmpLocations: [],
    }
  },

  mounted() {
    this.fetchAssets()
    this.fetchProducts()
    this.tmpLocations = this.locations
    this.tmpLocations.unshift({ name: 'all', id: '*' })
  },

  computed: {
    ...mapState(['locations']),
    panelTitle() {
      return this.isEditing ? 'Edit a asset' : 'Create a new asset'
    },
  },
  methods: {
    handleLocationChange(locationId) {
      this.filteredAssets = []
      if (locationId === '*') {
        this.filteredAssets = this.assets
      } else {
        this.assets.find((_value) => {
          if (_value.locationId === locationId) {
            this.filteredAssets.push(_value)
          }
        })
      }
    },
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
    },

    handleClickEdit() {
      this.isEditing = true
    },
    handleClickCancelEdit() {
      this.isEditing = false
    },

    async handleSubmit(values) {
      try {
        if (!this.selected.id) {
          await API.createAsset(values)
          message.success('New asset created')
        } else {
          await API.updateAsset(this.selected.id, values)
          message.success('Asset is updated')
        }
        this.showEditPanel = false
        this.fetchAssets()
      } catch (e) {
        message.error(e.message)
      }
    },

    handleViewRecord(assetId) {
      this.selected = this.assets.find((asset) => asset.id === assetId)
      this.showEditPanel = true
      this.isEditing = false
    },

    async handleRemoveRecord(assetId) {
      try {
        await API.removeAsset(assetId)
        message.info('Asset Removed!')
        this.assets = _.cloneDeep(this.assets).filter((asset) => asset.id !== assetId)
      } catch (e) {
        message.error(e.message)
      }
    },

    formatDate(date) {
      return moment(date).format('YYYY MMM DD HH:mm')
    },

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

    async fetchProducts() {
      this.fetching = true
      try {
        this.products = await API.getProducts()
        this.fetching = false
      } catch (e) {
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

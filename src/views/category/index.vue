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
      <strong>Categories</strong>
    </div>
    <div class="card">
      <div class="card-header card-header-flex">
        <div class="d-flex flex-column justify-content-center mr-auto">
          <h5 class="mb-0">Categories</h5>
        </div>
        <div class="d-flex flex-column justify-content-center">
          <a class="btn btn-primary" @click="handleNewCategory">New Category</a>
        </div>
      </div>
      <div class="card-body">
        <a-table :columns="columns" :dataSource="categories" rowKey="id">
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
          <template slot="value" slot-scope="text">
            <span class="font-weight-bold">{{ text }}</span>
          </template>
          <div slot="sections" slot-scope="sections">
            <a-tag color="blue" v-for="section in sections" :key="section.id">
              {{ section.name }}
            </a-tag>
          </div>
          <span slot="createdAt" slot-scope="date">{{ formatDate(date) }}</span>
          <span slot="updatedAt" slot-scope="date">{{ formatDate(date) }}</span>
          <span slot="action" slot-scope="record">
            <a @click="handleViewRecord(record.id)" class="btn btn-sm btn-light mr-2">
              <i class="fe fe-edit mr-2" />
              View
            </a>
            <a-popconfirm
              title="Are you sure delete this category?"
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

const columns = [
  {
    title: 'No',
    key: 'no',
    scopedSlots: { customRender: 'no' },
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => (a > b ? 1 : -1),
  },
  {
    title: 'Sections',
    dataIndex: 'sections',
    key: 'id',
    scopedSlots: { customRender: 'sections' },
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    scopedSlots: { customRender: 'createdAt' },
  },
  {
    title: 'Last Update',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    scopedSlots: { customRender: 'updatedAt' },
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
      categories: [],
      columns,
      showEditPanel: false,
      isEditing: false,
      isCreating: false,
      fetching: false,
      selected: {},
    }
  },

  mounted() {
    this.fetchCategories()
  },

  computed: {
    panelTitle() {
      return this.isEditing ? 'Edit a category' : 'Create a new category'
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

    handleNewCategory(event) {
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
        if (!this.selected.id) await API.createCategory(values)
        else await API.updateCategory(this.selected.id, { ...this.selected, ...values })
        this.showEditPanel = false
        message.success(this.selected.id ? 'Category has updated' : 'New category has created')
        this.fetchCategories()
      } catch (e) {
        message.error(e.message)
      }
    },

    handleViewRecord(categoryId) {
      this.selected = this.categories.find((category) => category.id === categoryId)
      this.showEditPanel = true
      this.isEditing = false
    },

    async handleRemoveRecord(categoryId) {
      try {
        await API.removeCategory(categoryId)
        message.info('Location Removed!')
        this.categories = _.cloneDeep(this.categories).filter(
          (category) => category.id !== categoryId,
        )
      } catch (e) {
        message.error(e.message)
      }
    },

    formatDate(date) {
      return moment(date).format('YYYY MMM DD HH:mm')
    },

    async fetchCategories() {
      this.fetching = true
      try {
        this.categories = await API.getCategories()
        this.fetching = false
      } catch (e) {
        console.log(e.message)
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

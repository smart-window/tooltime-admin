<template>
  <a-drawer
    :title="title"
    :width="720"
    :visible="showPanel"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleCloseEditingPanel"
  >
    <a-form :form="form" layout="vertical" hide-required-mark>
      <a-row :gutter="16">
        <a-col :span="12">
          <span>
            <a-icon type="user" />
            <span> {{ item.Customer.name }}</span>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <span>
            <a-icon type="mail" />
            <span> {{ item.email }}</span>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <span>
            <a-icon type="phone" />
            <span> {{ item.phone }}</span>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <span>
            <a-icon type="environment" />
            <span>
              {{ item.state + ', ' + item.city + ', ' + item.address + ', ' + item.zip }}</span
            >
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <span>
            <a-icon type="calendar" />
            <span> {{ item.pickupDate }}</span>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-table :columns="columns" :data-source="data" class="components-table-demo-nested">
            <a slot="operation">Publish</a>
            <a-table
              slot="expandedRowRender"
              :columns="innerColumns"
              :data-source="innerData"
              :pagination="false"
            >
              <span slot="status"> <a-badge status="success" />Finished </span>
              <span slot="operation" class="table-operation">
                <a>Pause</a>
                <a>Stop</a>
                <a-dropdown>
                  <a-menu slot="overlay">
                    <a-menu-item> Action 1 </a-menu-item>
                    <a-menu-item> Action 2 </a-menu-item>
                  </a-menu>
                  <a> More <a-icon type="down" /> </a>
                </a-dropdown>
              </span>
            </a-table>
          </a-table>
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
      <a-button
        type="secondary"
        @click="handleEdit"
        v-if="!editing"
        :style="{ marginRight: 'auto' }"
      >
        Edit
      </a-button>
      <a-button v-if="editing" :style="{ marginRight: '8px' }" @click="handleCancelEditing">
        Cancel
      </a-button>
      <a-button v-if="!editing" :style="{ marginRight: '8px' }" @click="handleCloseEditingPanel">
        Close
      </a-button>
      <a-button type="primary" @click="handleSubmit" :disabled="!editing"> Submit </a-button>
    </div>
  </a-drawer>
</template>

<script>
const columns = [
  { title: 'Product', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation', scopedSlots: { customRender: 'operation' } },
]

const data = []
for (let i = 0; i < 3; ++i) {
  data.push({
    key: i,
    name: 'Screem',
    platform: 'iOS',
    version: '10.3.4.5654',
    upgradeNum: 500,
    creator: 'Jack',
    createdAt: '2014-12-24 23:12:00',
  })
}

const innerColumns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', key: 'state', scopedSlots: { customRender: 'status' } },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  {
    title: 'Action',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
]

const innerData = []
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    date: '2014-12-24 23:12:00',
    name: 'This is production name',
    upgradeNum: 'Upgraded: 56',
  })
}
export default {
  name: 'EditPanel',
  props: ['showPanel', 'close', 'submit', 'item', 'editing', 'onEdit'],

  mounted() {},

  data() {
    return {
      form: this.$form.createForm(this, this.item),
      fields: ['name', 'email', 'address', 'city', 'state', 'zip', 'notes', 'status'],
      data,
      columns,
      innerColumns,
      innerData,
    }
  },

  computed: {
    title() {
      if (this.item.id && !this.editing) return 'View order'
      else if (this.item.id && this.editing) return 'Edit order'
      return 'Create order'
    },
  },
  methods: {
    handleSubmit(event) {
      event.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('submit', values)
        }
      })
    },

    handleEdit(event) {
      event.preventDefault()
      this.$emit('onEdit')
    },

    handleCancelEditing(event) {
      event.preventDefault()
      this.$emit('onCancelEdit')
    },
    handleCloseEditingPanel() {
      this.$emit('close')
    },
  },

  watch: {
    item(item) {
      console.log({ item })
      this.fields.forEach((field) => {
        this.form.setFieldsValue({ [field]: item[field] })
      })
    },
  },
}
</script>

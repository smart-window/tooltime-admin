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
          <h5>Order Details</h5>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <span>{{ item.Customer.name }}, </span>
          <span>{{ item.phone }}, </span>
          <span>{{ item.email }}</span>
          <a-table
            rowKey="id"
            :columns="columns"
            :data-source="data"
            expandIconColumnIndex="2"
            class="components-table-demo-nested"
            :expandIcon="expandIcon"
          >
            <a slot="operation">Publish</a>
            <span slot="productName" slot-scope="Product"> {{ Product.name }} </span>

            <template v-slot:expandedRowRender="orderItem">
              <a-table
                slot="expandedRowRender"
                :columns="innerColumns"
                :data-source="orderItem.Product.Assets"
                :pagination="false"
                rowKey="id"
              >
                <span slot="status"> <a-badge status="success" />Finished </span>
                <span slot="location" slot-scope="location">
                  {{ location.state + ', ' + location.city + ', ' + location.address_1 }}
                </span>
                <span slot="assetOperation" slot-scope="text, asset" class="table-operation">
                  <a-button @click="pickAsset(orderItem.id, asset.id)">Found it!</a-button>
                </span>
              </a-table>
            </template>
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
import * as API from '@/services/api'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: 'Product',
    dataIndex: 'Product',
    key: 'productName',
    scopedSlots: { customRender: 'productName' },
  },
  { title: 'Count', dataIndex: 'orderCount', key: 'orderCount' },
  { title: 'Action', key: 'operation', scopedSlots: { customRender: 'operation' } },
]

const data = []

const innerColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Make', dataIndex: 'make', key: 'make' },
  { title: 'Serial', dataIndex: 'sn', key: 'sn' },
  {
    title: 'Location',
    dataIndex: 'Location',
    key: 'location',
    scopedSlots: { customRender: 'location' },
  },
  {
    title: 'Action',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'assetOperation' },
  },
]

const innerData = []

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
    expandIcon(props) {
      return (
        <a-button
          onClick={(e) => {
            props.onExpand(props.record, e)
          }}
        >
          Process
        </a-button>
      )
    },

    async pickAsset(orderItemId, assetId) {
      const params = {
        orderItemId: orderItemId,
        id: assetId,
      }
      try {
        // this.orders = await API.setAsset(params)
        this.orders = await API.updateAsset(assetId, params)
        this.fetching = false
      } catch (e) {
        console.log(e.message)
        message.error(e.message)
        this.fetching = false
      }
    },
  },

  watch: {
    item(item) {
      console.log({ item })
      this.data = item.OrderItems
      this.fields.forEach((field) => {
        this.form.setFieldsValue({ [field]: item[field] })
      })
    },
  },
}
</script>

<template>
  <a-drawer
    v-if="item.id"
    :title="title"
    :width="720"
    :visible="showPanel"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleCloseEditingPanel"
  >
    <a-form :form="form" layout="vertical" hide-required-mark>
      <a-row :gutter="16">
        <a-col :span="12">
          <h5>
            <a-icon type="user" />
            <span> {{ item.Customer.name }}</span>
          </h5>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <h5>
            <a-icon type="mail" />
            <span> {{ item.email }}</span>
          </h5>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <h5>
            <a-icon type="phone" />
            <span> {{ item.phone }}</span>
          </h5>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <h5>
            <a-icon type="environment" />
            <span>
              {{ item.state + ', ' + item.city + ', ' + item.address + ', ' + item.zip }}</span
            >
          </h5>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <h5>
            <a-icon type="calendar" />
            <span> {{ item.pickupDate }}</span>
          </h5>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <h4 class="text-center">Order Details</h4>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <p class="text-center">{{ item.Customer.name }}, {{ item.phone }}, {{ item.email }}</p>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <p class="text-center">
            {{
              item.OrderItems.map((orderItem) => {
                return orderItem.Product.Assets.reduce((count, asset) => {
                  if (asset.orderItemId === orderItem.id) {
                    count++
                  }
                  return count
                }, 0)
              }).reduce((a, b) => a + b, 0)
            }}
            /
            {{
              item.OrderItems.reduce((productCount, orderItem) => {
                return productCount + orderItem.orderCount
              }, 0)
            }}
          </p>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-table
          :expandIcon="expandIcon"
          :expandIconColumnIndex="2"
          rowKey="id"
          :columns="columns"
          :data-source="data"
          class="components-table-demo-nested"
        >
          <a slot="operation">Publish</a>
          <span slot="productName" slot-scope="Product"> {{ Product.name }} </span>
          <span slot="orderCount" slot-scope="orderItem">
            {{
              orderItem.Product.Assets.reduce((count, asset) => {
                if (asset.orderItemId === orderItem.id) {
                  count++
                }
                return count
              }, 0)
            }}
            / {{ orderItem.orderCount }}
          </span>

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
                <a-button
                  v-if="asset.orderItemId === orderItem.id"
                  type="danger"
                  ghost
                  @click="pickAsset(null, asset.id)"
                >
                  Cancel
                </a-button>
                <a-button type="primary" ghost v-else @click="pickAsset(orderItem.id, asset.id)"
                  >Found it!</a-button
                >
              </span>
            </a-table>
          </template>
        </a-table>
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
      <a-button v-if="!editing" :style="{ marginRight: '8px' }" @click="handleCloseEditingPanel">
        Close
      </a-button>
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
  {
    title: 'Count',
    dataIndex: '',
    key: 'orderCount',
    scopedSlots: { customRender: 'orderCount' },
  },
  {
    title: '',
    dataIndex: '',
    key: 'expand',
    width: 1,
  },
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
      fields: [],
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

    resetAssets(record) {
      record.Product.Assets.map((asset) => {
        this.pickAsset(null, asset.id)
      })
    },

    expandIcon(props) {
      let resetShow = false
      props.record.Product.Assets.map((asset) => {
        if (asset.orderItemId === props.record.id) {
          resetShow = true
        }
      })
      if (resetShow === true) {
        return (
          <div>
            <a-button
              type="primary"
              onClick={(e) => {
                props.onExpand(props.record, e)
              }}
            >
              Process
            </a-button>
            <a-button
              onClick={(e) => {
                this.resetAssets(props.record)
              }}
              type="danger"
            >
              Reset
            </a-button>
          </div>
        )
      } else {
        return (
          <a-button
            type="primary"
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            Process
          </a-button>
        )
      }
    },

    async fetchOrder(id) {
      this.fetching = true
      try {
        this.item = await API.getOrder(id)
        this.fetching = false
      } catch (e) {
        console.log(e.message)
        message.error(e.message)
        this.fetching = false
      }
    },

    async pickAsset(orderItemId, assetId) {
      const params = {
        orderItemId: orderItemId,
        id: assetId,
      }
      try {
        await API.updateAsset(assetId, params)
        this.fetching = false
        this.fetchOrder(this.item.id)
        // this.$emit('submit')
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

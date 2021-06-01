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
        <a-col :span="24">
          <a-form-item label="Name">
            <a-input
              v-decorator="[
                'name',
                {
                  initialValue: item.name,
                  rules: [{ required: true, message: 'Name required' }],
                },
              ]"
              :disabled="!editing"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Product">
            <a-select
              v-decorator="[
                'productId',
                {
                  initialValue: item.productId,
                  rules: [{ required: true, message: 'Product required' }],
                },
              ]"
              :disabled="!editing"
            >
              <a-select-option v-for="pro in products" :key="pro.id">
                {{ pro.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Location">
            <a-select
              v-decorator="[
                'locationId',
                {
                  initialValue: item.locationId,
                  rules: [{ required: true, message: 'Location required' }],
                },
              ]"
              :disabled="!editing"
            >
              <a-select-option v-for="loc in locations" :key="loc.id">
                {{ loc.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Manufacture">
            <a-input
              v-decorator="[
                'make',
                {
                  initialValue: item.make,
                },
              ]"
              :disabled="!editing"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Model">
            <a-input
              v-decorator="[
                'model',
                {
                  initialValue: item.model,
                },
              ]"
              :disabled="!editing"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Serial Number">
            <a-input
              v-decorator="[
                'sn',
                {
                  initialValue: item.sn,
                },
              ]"
              :disabled="!editing"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Images">
            <div class="clearfix">
              <a-upload
                name="image"
                list-type="picture-card"
                :file-list="fileList"
                :headers="authorizationHeader"
                :beforeUpload="beforeUpload"
                :disabled="!editing"
                action="http://localhost:3000/admin/asset/upload"
                @preview="handleImagesPreview"
                @change="handleImagesChange"
              >
                <div v-if="fileList.length < 5">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleImagesCancel">
                <img alt="Images" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
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
import { mapState } from 'vuex'
import store from 'store'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  name: 'EditPanel',
  props: ['showPanel', 'close', 'submit', 'item', 'editing', 'onEdit', 'products'],

  mounted() {
    const accessToken = store.get('accessToken')
    this.authorizationHeader = {
      Authorization: `Bearer ${accessToken}`,
      AccessToken: accessToken,
    }
  },

  data() {
    return {
      form: this.$form.createForm(this, this.item, this.products),
      fields: ['name', 'sectionId', 'assetId', 'description'],
      sections: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      authorizationHeader: {},
    }
  },

  computed: {
    ...mapState(['categories', 'locations']),
    title() {
      if (this.item.id && !this.editing) return 'View asset'
      else if (this.item.id && this.editing) return 'Edit asset'
      return 'Create asset'
    },
  },
  methods: {
    handleImagesCancel() {
      this.previewVisible = false
    },

    async handleImagesPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    handleImagesChange({ fileList }) {
      this.fileList = fileList
    },

    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload image file!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
        return false
      }
      this.fileList = [...this.fileList, file]
      return true
    },

    handleSubmit(event) {
      event.preventDefault()
      this.form.validateFields((err, values) => {
        values.images = ''
        this.fileList.map((file, idx) => {
          values.images += file.response ? file.response.fullPath : file.url
          values.images += idx === this.fileList.length - 1 ? '' : ','
        })
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
      this.fileList = []
      if (item.images) {
        item.images.split(',').map((url, idx) => {
          const tmp = {
            uid: idx,
            name: 'image' + idx,
            status: 'done',
            url: url,
          }
          this.fileList.push(tmp)
        })
      }

      this.fields.forEach((field) => {
        this.form.setFieldsValue({ [field]: item[field] })
      })
    },
  },
}
</script>

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
export default {
  name: 'EditPanel',
  props: ['showPanel', 'close', 'submit', 'item', 'editing', 'onEdit'],

  mounted() {},

  data() {
    return {
      form: this.$form.createForm(this, this.item),
      fields: ['name'],
    }
  },

  computed: {
    title() {
      if (this.item.id && !this.editing) return 'View section'
      else if (this.item.id && this.editing) return 'Edit section'
      return 'Create section'
    },
  },
  methods: {
    handleSubmit(event) {
      event.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
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

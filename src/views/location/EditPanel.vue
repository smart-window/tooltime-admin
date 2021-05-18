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
        <a-col :span="8">
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
        <a-col :span="8">
          <a-form-item label="City">
            <a-input
              v-decorator="[
                'city',
                {
                  rules: [{ required: true, message: 'City required' }],
                },
              ]"
              placeholder="Please enter City"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Zip Code">
            <a-input
              v-decorator="[
                'zip',
                {
                  rules: [{ required: true, message: 'ZipCode required' }],
                },
              ]"
              placeholder="Please enter Zip Code"
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
      <a-row :gutter="16">
        <a-col :span="24">
          <GmapMap
            :center="{ lat: 10, lng: 10 }"
            :zoom="7"
            map-type-id="terrain"
            style="width: 100%; height: 300px"
          >
          </GmapMap>
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
      <a-button :style="{ marginRight: '8px' }" @click="handleCloseEditingPanel"> Cancel </a-button>
      <a-button type="primary" @click="handleSubmit"> Submit </a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'EditPanel',
  props: ['title', 'showPanel', 'close', 'submit', 'item'],

  mounted() {},

  data() {
    return {
      form: this.$form.createForm(this, this.item),
    }
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

    handleCloseEditingPanel() {
      this.$emit('close')
    },
  },

  watch: {
    item(item) {
      this.form.setFieldsValue(item)
    },
  },
}
</script>

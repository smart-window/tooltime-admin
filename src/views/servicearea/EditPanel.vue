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
        <a-col :span="12">
          <a-form-item label="Longitutde">
            <a-input
              v-decorator="[
                'longitude',
                {
                  initialValue: item.longitude,
                  rules: [{ required: true, message: 'Required field' }],
                },
              ]"
              :disabled="!editing"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Latitude">
            <a-input
              v-decorator="[
                'latitude',
                {
                  initialValue: item.latitude,
                  rules: [{ required: true, message: 'Required field' }],
                },
              ]"
              :disabled="!editing"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Location">
            <a-select
              v-decorator="[
                'locationId',
                {
                  initialValue: item.locationId,
                  rules: [{ required: true, message: 'Required field' }],
                },
              ]"
              :disabled="!editing"
              @change="handleLocationChange"
            >
              <a-select-option
                :key="location.id"
                :value="location.id"
                v-for="location in locations"
              >
                {{ location.name }}
              </a-select-option>
            </a-select>
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
                  initialValue: item.state,
                  rules: [{ required: true, message: 'State required' }],
                },
              ]"
              placeholder="Please enter state"
              disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="City">
            <a-input
              v-decorator="[
                'city',
                {
                  initialValue: item.city,
                  rules: [{ required: true, message: 'City required' }],
                },
              ]"
              placeholder="Please enter City"
              disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Zip Code">
            <a-input
              v-decorator="[
                'zip',
                {
                  initialValue: item.zip,
                  rules: [{ required: true, message: 'ZipCode required' }],
                },
              ]"
              placeholder="Please enter Zip Code"
              disabled
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
                  initialValue: item.description,
                  rules: [{ required: true, message: 'Please enter url description' }],
                },
              ]"
              :rows="4"
              placeholder="please enter url description"
              :disabled="!editing"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <GmapMap
            :center="{ lat: position.lon, lng: position.lan }"
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
      <a-button
        type="secondary"
        @click="handleEdit"
        v-if="!editing"
        :style="{ marginRight: 'auto' }"
      >
        Edit
      </a-button>
      <a-button
        v-if="editing && item.id"
        :style="{ marginRight: '8px' }"
        @click="handleCancelEditing"
      >
        Cancel
      </a-button>
      <a-button :style="{ marginRight: '8px' }" @click="handleCloseEditingPanel"> Close </a-button>
      <a-button type="primary" @click="handleSubmit" :disabled="!editing"> Submit </a-button>
    </div>
  </a-drawer>
</template>

<script>
// import { gmapApi } from 'vue2-google-maps'
import { mapState } from 'vuex'
export default {
  name: 'EditPanel',
  props: ['showPanel', 'close', 'submit', 'item', 'editing', 'onEdit'],

  mounted() {
    // this.autocomplete = gmapApi.maps.places.Autocomplete(this.$refs.autocomplete, {
    //   types: ['geocode'],
    // })
  },

  data() {
    return {
      form: this.$form.createForm(this, this.item),
      fields: ['name', '', 'locationId', 'city', 'state', 'zip', 'description'],
    }
  },

  computed: {
    ...mapState(['locations']),
    title() {
      if (this.item.id && !this.editing) return 'View Service area'
      else if (this.item.id && this.editing) return 'Edit Service area'
      return 'Create Service area'
    },
    position() {
      const formObj = this.form.getFieldsValue(['longitude', 'latitude'])
      return {
        lon: formObj.longitude,
        lat: formObj.latitude,
      }
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

    handleLocationChange(locationId) {
      console.log(locationId)
      const location = this.locations.find((location) => location.id === locationId)
      console.log(location)
      this.form.setFieldsValue({
        state: location.state,
        city: location.city,
        zip: location.zip,
      })
    },
    /**
     * When the location found
     * @param {Object} addressData Data of the found location
     * @param {Object} placeResultData PlaceResult object
     * @param {String} id Input container ID
     */
    getAddressData: function (addressData, placeResultData, id) {
      console.log({ addressData })
      // this.address = addressData
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

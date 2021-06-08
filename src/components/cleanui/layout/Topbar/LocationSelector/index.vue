<template>
  <div>
    <a-select
      default-value="*"
      v-bind:style="{ width: '200px', marginLeft: '100px' }"
      @change="handleLocationChange"
    >
      <template v-slot:suffixIcon>
        <i class="fas fa-map-marker-alt"></i>
      </template>
      <a-select-option v-for="loc in tmpLocations" :key="loc.id" :value="loc.id">
        {{ loc.name }}
      </a-select-option>
      <!-- <a-select-option value="jack"> Jack </a-select-option>
      <a-select-option value="lucy"> Lucy </a-select-option>
      <a-select-option value="disabled" disabled> Disabled </a-select-option>
      <a-select-option value="Yiminghe"> yiminghe </a-select-option> -->
    </a-select>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: function () {
    return {
      tmpLocations: [],
    }
  },
  computed: {
    ...mapState(['locations']),
  },
  mounted() {
    this.tmpLocations = this.locations.map((location) => {
      return location
    })
    this.tmpLocations.unshift({ name: 'all', id: '*' })
  },
  methods: {
    handleChange() {
      console.log('aaa')
    },
    handleLocationChange() {},
  },
}
</script>
<style lang="scss" module>
@import './style.module.scss';
</style>

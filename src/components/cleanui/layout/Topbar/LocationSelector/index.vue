<template>
  <div>
    <a-select default-value="lucy" style="width: 120px" @change="handleChange">
      <template v-slot:suffixIcon>
        <i class="fas fa-map-marker-alt"></i>
      </template>
      <a-select-option value="jack"> Jack </a-select-option>
      <a-select-option value="lucy"> Lucy </a-select-option>
      <a-select-option value="disabled" disabled> Disabled </a-select-option>
      <a-select-option value="Yiminghe"> yiminghe </a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  methods: {
    handleChange() {
      console.log('aaa')
    },
  },
}
</script>
<style lang="scss" module>
@import './style.module.scss';
</style>

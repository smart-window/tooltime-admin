<template>
  <div :class="$style.topbar">
    <div class="mr-4">
      <cui-fav-pages />
    </div>
    <div class="mr-auto">
      <cui-search />
    </div>
    <div class="mr-4 d-none d-md-block">
      <location-selector />
    </div>
    <div class="mr-4 d-none d-sm-block">
      <cui-actions />
    </div>
    <div>
      <cui-user-menu />
    </div>
  </div>
</template>

<script>
import CuiSearch from './Search'
import CuiActions from './Actions'
import CuiUserMenu from './UserMenu'
import CuiFavPages from './FavPages'
import LocationSelector from './LocationSelector'

export default {
  components: {
    CuiSearch,
    CuiActions,
    CuiUserMenu,
    CuiFavPages,
    LocationSelector,
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>

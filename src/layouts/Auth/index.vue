<template>
  <a-layout>
    <a-layout-content>
      <cui-sidebar />
      <cui-support-chat />
      <div
        :class="{
          [$style.container]: true,
          cui__layout__squaredBorders: settings.isSquaredBorders,
          cui__layout__cardsShadow: settings.isCardShadow,
          cui__layout__borderless: settings.isBorderless,
          [$style.white]: settings.authPagesColor === 'white',
          [$style.gray]: settings.authPagesColor === 'gray',
        }"
        :style="{
          backgroundImage:
            settings.authPagesColor === 'image'
              ? `url(resources/images/content/photos/7.jpg)`
              : 'none',
        }"
      >
        <div
          :class="{
            [$style.topbar]: true,
            [$style.topbarGray]: settings.isGrayTopbar,
          }"
        >
          <div :class="$style.logoContainer">
            <div :class="$style.logo">
              <img src="resources/images/logo.svg" class="mr-2" alt="Clean UI" />
              <div :class="$style.name">{{ settings.logo }}</div>
              <div v-if="settings.logo === 'Clean UI Pro'" :class="$style.descr">Vue</div>
            </div>
          </div>
          <div class="d-none d-sm-block">
            <span class="mr-2">Don't have an account?</span>
            <router-link to="/auth/register" class="font-size-16 kit__utils__link"
              >Sign up</router-link
            >
          </div>
        </div>
        <div :class="$style.containerInner">
          <transition :name="settings.routerAnimation" mode="out-in">
            <router-view />
          </transition>
        </div>
        <div class="mt-auto pb-5 pt-5">
          <div class="text-center">Copyright © 2021</div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
import CuiSidebar from '@/components/cleanui/layout/Sidebar'
import CuiSupportChat from '@/components/cleanui/layout/SupportChat'

export default {
  name: 'AuthLayout',
  components: { CuiSidebar, CuiSupportChat },
  computed: mapState(['settings']),
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>

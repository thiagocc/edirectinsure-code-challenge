<template>
  <v-app :dark="true">
    <router-view></router-view>
    <!-- setting drawer -->
    <v-navigation-drawer
      class="setting-drawer"
      temporary
      right
      v-model="rightDrawer"
      hide-overlay
      fixed
    >
    </v-navigation-drawer>
    <!-- global snackbar -->
    <v-snackbar
      :timeout="3000"
      bottom
      right
      :color="snackbar.color"
      v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <v-btn dark text @click.native="snackbar.show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import AppEvents from './event'

export default {
  components: {},
  data() {
    return {
      rightDrawer: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
      },
    }
  },
  mounted() {},
  created() {
    this.$vuetify.theme.themes.light.primary = '#005d91'

    AppEvents.forEach(item => {
      this.$on(item.name, item.callback)
    })
    window.getApp = this
  },
  methods: {
    openThemeSettings() {
      this.$vuetify.goTo(0)
      this.rightDrawer = !this.rightDrawer
    },
  },
}
</script>

<style lang="sass" scoped>
.setting-fab
  top: 50% !important
  right: 0
  border-radius: 0
</style>

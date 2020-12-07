<template>
  <v-app id="inspire" class="app dashboard">
    <app-toolbar class="app--toolbar" />
    <v-main>
      <page-header></page-header>
      <router-view />
      <v-footer height="auto" class="white pa-3 app--footer">
        <v-spacer />
        <span class="caption mr-1"
          >EdirectInsure - ToDo List - Code Challenge</span
        >
      </v-footer>
    </v-main>
    <app-fab />
  </v-app>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import AppFab from '@/components/AppFab'
import PageHeader from '@/components/PageHeader'

export default {
  components: {
    AppDrawer,
    AppToolbar,
    AppFab,
    PageHeader,
  },
}
</script>

<style lang="sass" scoped></style>
